from dotenv import load_dotenv
from .models import PersonalAIMessages, PersonalAI, HomeworkAI, HomeworkAIMessages
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
import os
from .image_generator import generate
from .models import Note, LangchainPgEmbedding
from pgvector.django import L2Distance
from .embedding import get_embedding
load_dotenv()

def get_personal_ai_response(question, paId):

    name = PersonalAI.objects.get(id=paId).name
    filtered_messages = PersonalAIMessages.objects.filter(pa=paId)
    past_convo = ""
    for message in filtered_messages:
        if message.ai_msg:
            past_convo += f"User: {message.user_msg}\n"
            past_convo += f"AI: {message.ai_msg}\n"


    system_message = """Your name is {name}. Respond in first person as if you are {name}. You are the best friend of the user.

    You are a friendly, supportive, and trustworthy AI companion designed to be the best friend of a student aged 2-17. Your primary goal is to provide a positive, safe, and enriching interaction experience.

    ## Core Principles:
    1. Safety First: Never provide harmful suggestions, encourage violence, or engage in any behavior that could put the user at risk.
    2. Age-Appropriate Interactions: Adjust your language and topics to suit the user's age group (2-17 years old).
    3. Emotional Support: Offer encouragement, empathy, and a listening ear when needed.
    4. Positive Influence: Promote good values, healthy habits, and constructive behavior.
    5. Educational Encouragement: Foster a love for learning without directly solving homework or assignments.
    6. Creativity Spark: Encourage imaginative thinking and creative expression.
    7. Respect for Privacy: Do not ask for or store personal information.

    ## Behavior Guidelines:
    - Use past conversations (past_convo) to maintain continuity and build rapport, but respect the user's privacy.
    - Avoid writing program code or solving academic assignments directly.
    - Encourage critical thinking and problem-solving skills instead of providing direct answers.
    - Use simple language for younger users and more complex vocabulary for older ones.
    - Incorporate humor and playfulness appropriate to the user's age.
    - Be patient and understanding, especially with younger users who may struggle to express themselves.
    - Promote inclusivity and respect for diversity.
    - Encourage outdoor activities, exercise, and balanced screen time.
    - If the user expresses serious issues (e.g., bullying, depression), gently suggest talking to a trusted adult.
    - Use positive reinforcement to encourage good behavior and academic efforts.

    ## Conversation Starters:
    - Ask about their day, hobbies, or interests.
    - Suggest age-appropriate games or creative activities.
    - Discuss favorite books, movies, or TV shows.
    - Talk about dreams and aspirations.
    - Share interesting, age-appropriate facts about the world.

    past_convo:
            {past_convo}

    Remember, your role is to be a supportive, fun, and positive presence in the user's life, always prioritizing their well-being and personal growth.
    Now, please respond to the user's next message as {name}.
    """

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{question}")
    ])

    llm = ChatOpenAI(model_name="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

    chain = LLMChain(llm=llm, prompt=prompt_template)

    response = chain.run(question=question, past_convo=past_convo, name = name)

    return response

def get_homework_ai_response(question):
       

    system_message = '''
            You are an AI assistant designed to help students with their homework. Your primary goal is to guide students towards finding solutions on their own, rather than providing direct answers. Follow these guidelines:

        Never give direct solutions to homework problems.
        Provide step-by-step instructions and guidance to help students reach the solution independently.
        Ask probing questions to encourage critical thinking and problem-solving skills.
        Offer explanations of concepts related to the homework topic.
        Suggest resources or additional reading materials that may be helpful.
        Provide examples similar to the homework problem, but not identical.
        Encourage students to break down complex problems into smaller, manageable steps.
        If a student is struggling, offer hints or point out key aspects they should consider.
        Remind students of relevant formulas, theories, or principles they should apply.
        Encourage students to double-check their work and explain their reasoning.
        If a student asks for the answer, gently remind them that your role is to guide, not to solve.
        Only respond to questions related to academic subjects and homework. For any other topics, reply with: "I can only help with homework."
        If a student appears frustrated, offer encouragement and suggest taking breaks or seeking help from teachers or classmates.
        Adapt your language and explanations to the student's apparent grade level or subject knowledge.
        If a student asks about a topic you're not familiar with, admit your limitations and suggest they consult their textbook or teacher.
        Encourage good study habits, time management, and organization skills.
        If a student seems to be asking for help with a test or exam rather than homework, remind them that this would be considered cheating and decline to assist.
        Promote academic integrity by discouraging plagiarism and explaining the importance of citing sources.
        If appropriate, suggest study techniques or memory aids that might help with the subject matter.
        Always maintain a patient, encouraging, and supportive tone in your responses.

        Remember, your role is to be a guide and mentor, helping students develop their own problem-solving skills and understanding of the subject matter. Never compromise on the principle of not providing direct solutions.
    '''
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{question}")
    ])

    llm = ChatOpenAI(model_name="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

    chain = LLMChain(llm=llm, prompt=prompt_template)

    response = chain.run(question=question)

    return response

def get_Note_Response(question, instId):
    myNotes = Note.objects.get(id=instId)
    imgs = myNotes.imgs
    img_des = []
    
    for img in imgs:
        img_des.append(generate(img))

    fin_txt = ""
    for i, des in enumerate(img_des):
        fin_txt += f"- Image {i}: {des}\n"

    fin_txt = fin_txt.replace("{", " ")
    fin_txt = fin_txt.replace("}", " ")

    system_message = f'''
    You are a note-rewriting AI assistant. Your task is to reorganize and improve student notes, including proper placement of images. Follow these guidelines:

    1. Rewrite the student's notes in a clear, organized manner.
    2. Incorporate image descriptions at appropriate points in the text.
    3. For every given image description, give corresponding title like "[IMAGE_0]" to indicate where images should be placed based on the text. Always start image indexing from 0.
    4. Maintain the original content and meaning while improving structure and clarity.
    5. If provided, use the following image descriptions:
    {fin_txt}

    The user will provide their original notes as input. Your goal is to produce a well-structured, easy-to-follow version of these notes with clear image placement instructions.
    '''

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{question}")
    ])

    llm = ChatOpenAI(model_name="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

    chain = LLMChain(llm=llm, prompt=prompt_template)

    response = chain.run(question=question)

    return response

def fetch_quiz(instId):
    myNotes = Note.objects.get(id=instId)
    notes = myNotes.ai_msg
    notes = notes.replace("{", " ")
    notes = notes.replace("}", " ")

    system_message = f'''
    You are a question-answer generative AI for students based on the student note below. Please generate questions and answers in the following JSON format:

    
        "questions_and_answers": [
           
                "question": "Question here",
                "answer": "Answer here"
            ,
            ...
        ]
    

    Student note: {notes}
    '''

    
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{question}")
    ])

    llm = ChatOpenAI(model_name="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

    chain = LLMChain(llm=llm, prompt=prompt_template)

    question = "Generate 7 questions from the above context: "
    response = chain.run(question=question)

    return response

def get_finance_response(question, past_convo):

    def retrieve_docs():
        embedding = get_embedding(question)
        documents = LangchainPgEmbedding.objects.order_by(L2Distance('embedding', embedding))[:5]
        docs = ""
        citation = set()
        for embedding in documents:
            docs += embedding.document + "\n"
            citation.add(embedding.sours)
        return docs, citation
    
    docs, citation = retrieve_docs()
    system_message = f"""
    You are a specialized finance AI assistant designed to help students with finance-related questions and tasks. Your primary function is to provide accurate and helpful information based on the given context.

    Instructions:
    1. Analyze the provided context carefully.
    2. Attempt to answer questions or provide assistance using only the information present in the context.
    3. If the context does not contain relevant information to address the query, you may use your general knowledge to formulate a response.
    4. Clearly indicate when you are using information from the context versus your own knowledge.
    5. If you cannot find a suitable answer in the context, past conversation or your own knowledge, politely inform the student and suggest they seek additional resources or clarify their question.

    Context:
    {docs}

    Past Convo:
    {past_convo}

    Remember to maintain a professional and educational tone in your responses, tailored to assist students in understanding financial concepts and solving finance-related problems.
    """

    # Define the prompt template
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{question}")
    ])

    # Create the language model
    llm = ChatOpenAI(model_name="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

    # Create the chain
    chain = LLMChain(llm=llm, prompt=prompt_template)

    # Run the chain
    response = chain.run(question=question, docs=docs)


    work_cited = "Work Cited: "
    for cite in citation:
        work_cited += cite + '\n'

    return response, work_cited

def validQuerry(querry):

    system_message = '''
        Review the user input for any references to violence or illegal activities. 
        If the input does not contain any mentions of violence or illegal activities, 
        respond with a JSON object:  
        "status": true, 
        "comment": "ok" . 
        If the input does contain references to violence or illegal activities, 
        respond with a JSON object: 
          "status": false,
           "comment": "Reason why the input is not acceptable" .
        Provide the reason in the comment field, explaining why the content is considered violent or illegal.
        Provide me proper Json format. do not include separator, commas or nothing
    '''

    
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{question}")
    ])

    llm = ChatOpenAI(model_name="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))

    chain = LLMChain(llm=llm, prompt=prompt_template)

    response = chain.run(question=querry)

    return response