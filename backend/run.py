from app import create_app, db
from app.models import User, Pet, Activity, Reminder, MedicalRecord, Vaccination
import os

app = create_app(os.environ.get('FLASK_ENV', 'default'))

@app.shell_context_processor
def make_shell_context():
    return {
        'db': db,
        'User': User,
        'Pet': Pet,
        'Activity': Activity,
        'Reminder': Reminder,
        'MedicalRecord': MedicalRecord,
        'Vaccination': Vaccination
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
