import json
import secrets
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.management import call_command
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from ai.models import AIResult
from . import metrics


def index(request):
    if request.user.is_authenticated:
        return redirect('home')
    return redirect('login')


@login_required(login_url='login')
def home(request):
    product_metrics = metrics.get_product_metrics()
    sales_metrics = metrics.get_sales_metrics()
    graphic_product_category_metric = metrics.get_graphic_product_category_metric()
    graphic_product_brand_metric = metrics.get_graphic_product_brand_metric()
    daily_sales_data = metrics.get_daily_sales_data()
    daily_sales_quantity_data = metrics.get_daily_sales_quantity_data()
    ai_result = AIResult.objects.first()
    ai_result = ai_result.result if ai_result else None


    context = {
        'product_metrics': product_metrics,
        'sales_metrics': sales_metrics,
        'product_count_by_category': json.dumps(graphic_product_category_metric),
        'product_count_by_brand': json.dumps(graphic_product_brand_metric),
        'daily_sales_data': json.dumps(daily_sales_data),
        'daily_sales_quantity_data': json.dumps(daily_sales_quantity_data),
        'ai_result': ai_result,
    }

    return render(request, 'home.html', context)


@csrf_exempt
@require_POST
def reset_demo(request):
    token = request.headers.get('X-Reset-Token', '') or request.GET.get('token', '')
    expected_token = settings.RESET_TOKEN

    if not expected_token or not secrets.compare_digest(token, expected_token):
        return JsonResponse({'detail': 'Token inválido.'}, status=403)

    call_command('reset_demo')
    return JsonResponse({'detail': 'Dados de demonstração reiniciados com sucesso.'})
