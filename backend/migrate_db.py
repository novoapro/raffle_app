import sqlite3
from contextlib import contextmanager

@contextmanager
def get_db(db_path='raffle.db'):
    conn = sqlite3.connect(db_path)
    try:
        yield conn
    finally:
        conn.close()

def migrate():
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Add photo column to participants table
        cursor.execute('''
            ALTER TABLE participants 
            ADD COLUMN photo_path TEXT
        ''')
        
        # Add photo_path and quantity columns to prizes table
        cursor.execute('''
            ALTER TABLE prizes 
            ADD COLUMN photo_path TEXT
        ''')
        
        cursor.execute('''
            ALTER TABLE prizes 
            ADD COLUMN quantity INTEGER DEFAULT 1
        ''')
        
        # Update existing prizes to have quantity of 1
        cursor.execute('''
            UPDATE prizes 
            SET quantity = 1 
            WHERE quantity IS NULL
        ''')
        
        conn.commit()

if __name__ == '__main__':
    migrate()
