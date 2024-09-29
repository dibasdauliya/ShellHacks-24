from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractUser
from pgvector.django import VectorField

class Parent(models.Model):
    email = models.EmailField(max_length=255)
    full_name = models.CharField(max_length=255)
    image =  models.URLField(max_length=255)

class Children(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dob = models.DateField()
    sex = models.CharField(max_length=100)
    content = models.TextField()
    parent = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    personal_voice = models.CharField(max_length=255, null=True)
    homework_voice = models.CharField(max_length=255, null=True)
    fin_voice = models.CharField(max_length=255, null=True)


class Images(models.Model):
    image = models.CharField(max_length=255)
    owner = models.ForeignKey(Children, on_delete=models.CASCADE)

class Message(models.Model):
    sender = models.CharField(max_length=255)
    recipient = models.CharField(max_length=255)
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-timestamp']

class Contact(models.Model):
    child = models.ForeignKey(Children, related_name='contacts', on_delete=models.CASCADE)
    friends = models.ManyToManyField(Children, related_name='friend_of')

    def __str__(self):
        return f"{self.child.first_name}'s friends"

    def add_friend(self, friend):
        self.friends.add(friend)
        Contact.objects.get_or_create(child=friend)[0].friends.add(self.child)

    def remove_friend(self, friend):
        self.friends.remove(friend)
        Contact.objects.get(child=friend).friends.remove(self.child)


class FriendRequest(models.Model):
    sender = models.ForeignKey(Children, on_delete=models.CASCADE)
    receiver = models.CharField(max_length=255)
    status = models.CharField(max_length=10, default='none')
    timestamp = models.DateTimeField(default=timezone.now)


class PersonalAI(models.Model):
    name = models.CharField(max_length=255)
    owner = models.CharField(max_length=255)

class PersonalAIMessages(models.Model):
    pa = models.CharField(max_length=255)
    user_msg = models.TextField()
    ai_msg = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

class HomeworkAI(models.Model):
    owner = models.CharField(max_length=255)

class HomeworkAIMessages(models.Model):
    hid = models.CharField(max_length=255)
    user_msg = models.TextField()
    ai_msg = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

class Note(models.Model):
    user_msg = models.TextField()
    imgs = models.JSONField(null=True)
    ai_msg = models.TextField(blank=True, null=True)
    owner = models.CharField(max_length=255)


class LangchainPgCollection(models.Model):
    name = models.TextField(blank=True, null=True)
    cmetadata = models.TextField(blank=True, null=True)  # This field type is a guess.
    uuid = models.UUIDField(primary_key=True)

    class Meta:
        db_table = 'langchain_pg_collection'


class LangchainPgEmbedding(models.Model):
    uuid = models.UUIDField(primary_key=True)
    collection = models.ForeignKey(LangchainPgCollection, models.DO_NOTHING, blank=True, null=True)
    embedding = VectorField(dimensions=1536) 
    document = models.TextField(blank=True, null=True)
    cmetadata = models.TextField(blank=True, null=True)
    sours = models.CharField(blank=True, null=True, max_length=255) 

    class Meta:
        db_table = 'langchain_pg_embedding'
