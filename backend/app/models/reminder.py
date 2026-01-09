from app import db
from datetime import datetime

class Reminder(db.Model):
    __tablename__ = 'reminders'
    
    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    reminder_type = db.Column(db.String(50), nullable=False)  # vaccination, medication, vet_appointment, grooming, other
    due_date = db.Column(db.DateTime, nullable=False)
    is_recurring = db.Column(db.Boolean, default=False)
    recurrence_interval = db.Column(db.String(20))  # daily, weekly, monthly, yearly
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'title': self.title,
            'description': self.description,
            'reminder_type': self.reminder_type,
            'due_date': self.due_date.isoformat(),
            'is_recurring': self.is_recurring,
            'recurrence_interval': self.recurrence_interval,
            'is_completed': self.is_completed,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'created_at': self.created_at.isoformat()
        }
