from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Outflow


@receiver(post_save, sender=Outflow)
def update_product_quantity(sender, instance, created, **kwargs):
    if created:
        if instance.quantity > 0:
            product = instance.product
            product.quantity -= instance.quantity
            product.save()


# Notificação via webhook para o projeto 03-Webhooks-Inventory-Management-System
# desativada neste deploy de demonstração: o serviço de webhooks não roda na Vercel
# (dependia de http://localhost:8001, inexistente em ambiente serverless).
# @receiver(post_save, sender=Outflow)
# def send_outflow_event(sender, instance, created, **kwargs):
#     try:
#         if created:
#             notify = Notify()
#
#             data = {
#                 'event_type': 'outflow',
#                 'timestamp': datetime.now().strftime('%d/%m/%Y, %H:%M:%S'),
#                 'product': instance.product.title,
#                 'cost_price': float(instance.cost_price),
#                 'selling_price': float(instance.selling_price),
#                 'quantity': instance.quantity,
#                 'description': instance.description,
#             }
#
#             notify.send_order_event(data)
#     except:
#         pass
