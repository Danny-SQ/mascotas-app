from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from config import config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    CORS(app, 
         origins=app.config['CORS_ORIGINS'], 
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'])
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.pets import pets_bp
    from app.routes.activities import activities_bp
    from app.routes.reminders import reminders_bp
    from app.routes.medical import medical_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(pets_bp, url_prefix='/api/pets')
    app.register_blueprint(activities_bp, url_prefix='/api/activities')
    app.register_blueprint(reminders_bp, url_prefix='/api/reminders')
    app.register_blueprint(medical_bp, url_prefix='/api/medical')
    
    @app.route('/health', methods=['GET'])
    def health():
        return {'status': 'ok'}, 200
    
    return app
