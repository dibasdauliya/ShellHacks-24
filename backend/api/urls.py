from django.urls import path
from .views import (
    ChildrenCreateView,
    ChildrenRetrieveUpdateDestroyView,
    SearchChildrenView,
    ImageListCreateView,
    ImageRetrieveUpdateDestroyView,
    MessageCreateView,
    MessageListView,
    ContactListView,
    ContactRetrieveUpdateDestroyView,
    FriendRequestListCreateView,
    FriendRequestListView,
    FriendRequestRetrieveUpdateDestroyView,
    AuthView,
    PersonalAIView,
    PersonalAIMessageView,
    HomeworkAIView,
    HomeworkAIMessageView,
    NoteListCreateView, NoteRetrieveView,
    login_view, callback_view, user_data_view, logout_view, index
)
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [

    path('login/', login_view, name='login'),
    path('callback/', callback_view, name='callback'),
    path('index/', index, name='user_data'),
    path('getuser/', user_data_view, name='user_data'),
    path('logout/', logout_view, name='logout'),
    
    # User Create garne view
    path('auth/', AuthView.as_view(), name='auth'),

     # Children URLs
    path('children/', ChildrenCreateView.as_view(), name='children-list-create'),
    path('search-children/', SearchChildrenView.as_view(), name='children-search'),

    
    path("children-login/", TokenObtainPairView.as_view(), name="children-login"),
    path('children/<int:pk>/', ChildrenRetrieveUpdateDestroyView.as_view(), name='children-retrieve-update-destroy'),

    # Images URLs
    path('images/', ImageListCreateView.as_view(), name='image-list-create'),
    path('images/<int:pk>/', ImageRetrieveUpdateDestroyView.as_view(), name='image-retrieve-update-destroy'),

    # Messages URLs
    path('messages/', MessageCreateView.as_view(), name='message-list-create'),
    path('get-messages/', MessageListView.as_view(), name='message-retrieve-update-destroy'),

    # Contacts URLs
    path('contacts/', ContactListView.as_view(), name='contact-list-create'),
    path('remove-contact/<int:pk>/', ContactRetrieveUpdateDestroyView.as_view(), name='contact-retrieve-update-destroy'),


    # Friend Requests URLs
    path('friend-requests/', FriendRequestListCreateView.as_view(), name='friend-request-list-create'),
    path('friend-requests-list/', FriendRequestListView.as_view(), name='friend-request-sent'),
    path('friend-requests/<int:pk>/', FriendRequestRetrieveUpdateDestroyView.as_view(), name='friend-request-retrieve-update-destroy'),

    path('name-ai/', PersonalAIView.as_view(), name='name-ai'),
    path('chat-personal-ai/', PersonalAIMessageView.as_view(), name='chat-personal-ai'),

    path('init-hwai/', HomeworkAIView.as_view(), name='init-homework-ai'),
    path('chat-hw-ai/', HomeworkAIMessageView.as_view(), name='chat-homework-ai'),

    path('notes/', NoteListCreateView.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', NoteRetrieveView.as_view(), name='note-retrieve'),


]
