from rest_framework import serializers
from .models import Parent, Children, Images, Message, Contact, FriendRequest, PersonalAI, PersonalAIMessages, HomeworkAI, HomeworkAIMessages, Note
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ['id', 'full_name', 'image', 'email']

class ChildrenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Children
        fields = ['id', 'first_name', 'last_name', 'dob', 'parent', 'content', 'sex', 'username', 'password', 'is_active'] 
        extra_kwargs = {'password': {'write_only': True}}
    
class ImageSerializer(serializers.ModelSerializer):
    owner = ChildrenSerializer(read_only=True)

    class Meta:
        model = Images
        fields = ['id', 'image', 'owner']
    
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp', 'is_read']
        read_only_fields = ['timestamp', 'sender']

class ContactSerializer(serializers.ModelSerializer):
    child = ChildrenSerializer(read_only=True)
    friends = ChildrenSerializer(many=True, read_only=True)

    class Meta:
        model = Contact
        fields = ['id', 'child', 'friends']

class FriendRequestSerializer(serializers.ModelSerializer):
    sender = ChildrenSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'status', 'timestamp']
        read_only_fields = ['timestamp']

class FriendRequestUpdateSerializer(serializers.ModelSerializer):
    sender = ChildrenSerializer(read_only=True)
    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'status', 'timestamp']
        read_only_fields = ['timestamp', 'receiver']

class PersonalAISerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalAI
        fields = ['id', 'name', 'owner']
        read_only_fields = ['owner']


class PersonalAIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalAIMessages
        fields = ['id', 'pa', 'user_msg', 'ai_msg', 'timestamp']
        ordering = ['timestamp']

class HomeworkAISerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkAI
        fields = ['id', 'owner']
        read_only_fields = ['owner']


class HomeworkAIMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkAIMessages
        fields = ['id', 'hid', 'user_msg', 'ai_msg', 'timestamp']
        ordering = ['timestamp']

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'user_msg', 'imgs', 'ai_msg', 'owner']
        read_only_fields = ['owner', 'ai_msg']

