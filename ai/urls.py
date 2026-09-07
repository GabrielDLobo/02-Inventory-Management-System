from django.urls import path
from . import views


urlpatterns = [
    path('api/v1/ai/latest/', views.AILatestResultAPIView.as_view(), name='ai-latest-api-view'),
    path('api/v1/ai/invoke/', views.AIInvokeAPIView.as_view(), name='ai-invoke-api-view'),
]
