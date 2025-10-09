# Generated migration for chat app

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('properties', '0001_initial'),
        ('payment', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversation_id', models.CharField(blank=True, max_length=20, unique=True)),
                ('conversation_type', models.CharField(choices=[('property_inquiry', 'Property Inquiry'), ('viewing_arrangement', 'Viewing Arrangement'), ('lease_discussion', 'Lease Discussion'), ('maintenance_support', 'Maintenance Support'), ('escrow_coordination', 'Escrow Coordination'), ('general_support', 'General Support')], default='property_inquiry', max_length=20)),
                ('is_active', models.BooleanField(default=True)),
                ('is_archived', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('last_message_at', models.DateTimeField(auto_now_add=True)),
                ('escrow', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conversations', to='payment.escrow')),
                ('participants', models.ManyToManyField(related_name='conversations', to=settings.AUTH_USER_MODEL)),
                ('property', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conversations', to='properties.property')),
            ],
            options={
                'ordering': ['-last_message_at'],
            },
        ),
        migrations.CreateModel(
            name='QuickAction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action_type', models.CharField(choices=[('book_viewing', 'Book Property Viewing'), ('create_escrow', 'Create Escrow'), ('schedule_call', 'Schedule Phone Call'), ('request_documents', 'Request Documents'), ('report_issue', 'Report Issue'), ('negotiate_price', 'Negotiate Price')], max_length=20)),
                ('label', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True)),
                ('requires_property', models.BooleanField(default=False)),
                ('requires_tenant_role', models.BooleanField(default=False)),
                ('requires_agent_role', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='TypingIndicator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_typing', models.BooleanField(default=True)),
                ('last_activity', models.DateTimeField(auto_now=True)),
                ('conversation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.conversation')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('conversation', 'user')},
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message_type', models.CharField(choices=[('text', 'Text Message'), ('image', 'Image'), ('document', 'Document'), ('location', 'Location'), ('payment_proof', 'Payment Proof'), ('system', 'System Message')], default='text', max_length=15)),
                ('content', models.TextField()),
                ('attachment', models.FileField(blank=True, null=True, upload_to='chat_attachments/')),
                ('attachment_filename', models.CharField(blank=True, max_length=255)),
                ('is_read', models.BooleanField(default=False)),
                ('is_edited', models.BooleanField(default=False)),
                ('is_deleted', models.BooleanField(default=False)),
                ('quick_actions', models.JSONField(blank=True, default=dict, help_text="Available quick actions like 'Book Viewing', 'Create Escrow'")),
                ('sent_at', models.DateTimeField(auto_now_add=True)),
                ('edited_at', models.DateTimeField(blank=True, null=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('conversation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='chat.conversation')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_messages', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['sent_at'],
            },
        ),
        migrations.CreateModel(
            name='MessageReadStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('read_at', models.DateTimeField(auto_now_add=True)),
                ('message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='read_statuses', to='chat.message')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('message', 'user')},
            },
        ),
        migrations.CreateModel(
            name='ChatModeration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.TextField()),
                ('action_taken', models.CharField(choices=[('flagged', 'Flagged for Review'), ('warned', 'User Warned'), ('message_removed', 'Message Removed'), ('user_suspended', 'User Suspended'), ('resolved', 'Resolved')], default='flagged', max_length=20)),
                ('resolution_notes', models.TextField(blank=True)),
                ('reported_at', models.DateTimeField(auto_now_add=True)),
                ('resolved_at', models.DateTimeField(blank=True, null=True)),
                ('message', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='moderations', to='chat.message')),
                ('reported_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reported_messages', to=settings.AUTH_USER_MODEL)),
                ('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='moderated_messages', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
