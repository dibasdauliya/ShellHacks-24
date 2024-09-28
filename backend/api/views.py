#import firebase_admin
#from firebase_admin import auth as firebase_auth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from .serializers import UserSerializer, ChildrenSerializer, ImageSerializer, MessageSerializer, ContactSerializer, FriendRequestSerializer, FriendRequestUpdateSerializer, PersonalAISerializer, PersonalAIMessageSerializer, HomeworkAISerializer, HomeworkAIMessageSerializer, NoteSerializer
from .models import Parent, Children, Images, Message, Contact, FriendRequest, PersonalAI, PersonalAIMessages, HomeworkAI, HomeworkAIMessages, Note
from .permissions import IsUserOrReadOnly
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q
from rest_framework.exceptions import NotFound
from .askAI import get_personal_ai_response, get_homework_ai_response, get_Note_Response
import json
from authlib.integrations.django_client import OAuth
from django.conf import settings
from django.shortcuts import redirect, render
from django.urls import reverse
from urllib.parse import quote_plus, urlencode
from django.views.decorators.http import require_GET
from django.http import JsonResponse

oauth = OAuth()

oauth.register(
    "auth0",
    client_id=settings.AUTH0_CLIENT_ID,
    client_secret=settings.AUTH0_CLIENT_SECRET,
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f"https://{settings.AUTH0_DOMAIN}/.well-known/openid-configuration",
)

class AuthView(generics.ListCreateAPIView):
    queryset = Parent.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

        
# Children Views
class ChildrenCreateView(generics.ListCreateAPIView):
    queryset = Children.objects.all()
    serializer_class = ChildrenSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        parent_id = self.request.data.get('parent')
        try:
            parent = Parent.objects.get(id=parent_id)
        except Parent.DoesNotExist:
            raise NotFound("Parent not found.")

        child = serializer.save()
        child.set_password(child.password)
        child.save()


class ChildrenRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Children.objects.all()
    serializer_class = ChildrenSerializer
    permission_classes = [IsUserOrReadOnly]

# Images Views
class ImageListCreateView(generics.ListCreateAPIView):
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user
        return Images.objects.filter(owner=user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
class SearchChildrenView(generics.ListAPIView):
    serializer_class = ChildrenSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        fullname = self.request.query_params.get('fullname', None)
        if fullname:
            if ' ' in fullname:
                first_name, last_name = fullname.split(' ', 1)
            else:
                first_name, last_name = fullname, ''
            
            # Attempt to find an exact match first
            exact_matches = Children.objects.filter(
                first_name__iexact=first_name, last_name__iexact=last_name
            )
            if exact_matches.exists():
                return exact_matches
            
            # If no exact match found, fall back to closest matches
            return Children.objects.filter(
                first_name__icontains=first_name
            ) | Children.objects.filter(
                last_name__icontains=last_name
            )
        
        return Children.objects.none()
    

class ImageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Images.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsUserOrReadOnly, IsAuthenticated]

# Message Views
class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    #permission_classes = [IsAuthenticated] 
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user.id)

class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sender_id = self.request.user.id
        recipient_id = self.request.query_params.get('recipient_id', None)

        if sender_id is not None and recipient_id is not None:
            return Message.objects.filter(
                (Q(sender=sender_id) & Q(recipient=recipient_id)) |
                (Q(sender=recipient_id) & Q(recipient=sender_id))
            )

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Contact Views
class ContactListView(generics.ListAPIView):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated] 
    def get_queryset(self):
        user = self.request.user
        return Contact.objects.filter(child=user)


class ContactRetrieveUpdateDestroyView(generics.DestroyAPIView):
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Contact.objects.filter(child=user)
    
    def destroy(self, request, *args, **kwargs):
        contact = self.get_object() 
        friend_id = request.data.get('friend_id')  

        if not friend_id:
            return Response({"detail": "friend_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = Children.objects.get(id=friend_id)
            contact.remove_friend(friend) 
            return Response({"detail": "Friend removed successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Children.DoesNotExist:
            return Response({"detail": "Friend not found"}, status=status.HTTP_404_NOT_FOUND)

# FriendRequest Views
class FriendRequestListCreateView(generics.ListCreateAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]
    #permission_classes = [IsAuthenticated] 
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class FriendRequestListView(generics.ListAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        status = self.request.query_params.get('type', None)
        if status == 'sent':
            return FriendRequest.objects.filter(Q(sender=user) & Q(status='pending'))
        elif status == 'received':
            return FriendRequest.objects.filter(Q(receiver=user.id) & Q(status='pending'))


class FriendRequestRetrieveUpdateDestroyView(generics.UpdateAPIView):
    serializer_class = FriendRequestUpdateSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return FriendRequest.objects.filter(Q(receiver=self.request.user.id))
    
    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status == 'accepted':
            sender = instance.sender
            receiver = Children.objects.get(id=instance.receiver)
            
            sender_contact, _ = Contact.objects.get_or_create(child=sender)
            sender_contact.add_friend(receiver)
            
            receiver_contact, _ = Contact.objects.get_or_create(child=receiver)
            receiver_contact.add_friend(sender)

class PersonalAIView(generics.ListCreateAPIView):
    serializer_class = PersonalAISerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return PersonalAI.objects.filter(owner=user.id)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.id)
    

class PersonalAIMessageView(generics.ListCreateAPIView):
    serializer_class = PersonalAIMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PersonalAIMessages.objects.filter(pa=self.request.data.get('pa'))
    
    def perform_create(self, serializer):
        instn = serializer.save()
        request = self.request
        instn.ai_msg = get_personal_ai_response(request.data.get('user_msg'), request.data.get('pa'))
        instn.save() 

class HomeworkAIView(generics.ListCreateAPIView):
    serializer_class = HomeworkAISerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return HomeworkAI.objects.filter(owner=user.id)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.id)
    

class HomeworkAIMessageView(generics.ListCreateAPIView):
    serializer_class = HomeworkAIMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HomeworkAIMessages.objects.filter(pa=self.request.data.get('pa'))
    
    def perform_create(self, serializer):
        instn = serializer.save()
        request = self.request
        instn.ai_msg = get_homework_ai_response(request.data.get('user_msg'))
        instn.save() 

class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(owner=user.id)
    
    # def get_serializer_class(self):
    #     if self.request.method == 'POST':
    #         return NoteSerializer  # Use the full serializer for POST
    #     return CustomNoteSerializer
    
    def perform_create(self, serializer):
        instn = serializer.save(owner=self.request.user.id)
        request = self.request
        instn.ai_msg = get_Note_Response(request.data.get('user_msg'), request.data.get('user_msg'))
        instn.save() 

class NoteRetrieveView(generics.RetrieveAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(owner=user.id)

@require_GET
def login_view(request):
    return oauth.auth0.authorize_redirect(
        request, request.build_absolute_uri(reverse("callback"))
    )

@require_GET
def callback_view(request):
    payload = oauth.auth0.authorize_access_token(request)
    request.session["user"] = payload['userinfo']
    userDetail = payload['userinfo']
    access_token = payload['access_token']

    email = userDetail['email']
    given_name = userDetail['given_name']
    family_name = userDetail['family_name']
    picture = userDetail['picture']


    user, created = Parent.objects.get_or_create(
        email=email,
        given_name= given_name,
        family_name= family_name,
        image= picture  
    )
    return redirect('http://localhost:5173?access_token={access_token}')

@require_GET
def index(request):
    return render(
        request,
        "index.html",
        context={
            "session": request.session.get("user"),
            "pretty": json.dumps(request.session.get("user"), indent=4),
        },
    )

@require_GET
def user_data_view(request):
    user_email = request.session.get("user")
    print(user_email)
    if not user_email:
        return JsonResponse({'error': 'User not found'}, status=404)
    
    try:
        user = Parent.objects.get(email=user_email)
        return JsonResponse({
            'user': {
                'email': user.email,
                'given_name': user.given_name,
                'family_name': user.family_name,
                'image': user.image
            }
        }, status=200)
    except Parent.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

def logout(request):
    request.session.clear()

    return redirect('http://localhost:5173')


@require_GET
def logout_view(request):
    request.session.flush()
    return redirect("/index")