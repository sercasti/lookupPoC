import boto3
import json
import random

def lambda_handler(event, context):
    entidades = ["Zara Clothing", "Shell Estacion Cordoba", "Starbucks", "Cafe Martinez", "Dolce Gusto Palermo", "Alto Avellaneda", "Pin Pun Pizzeria", "Los muchachos asador", "Somos Carne Asados", "La Parolaccia Puerto Madero", "La Quintana Banfield", "DonUs Company", "Green Tea Company", "SportClub S.A", "Easy Argentina", "Garbarino", "Compumundo"]
    
    rows = []
    for _ in range(random.randint(5,34)):
        row = {}
        row['fecha'] = str(random.randint(1, 29)) + "/" + str(random.randint(1, 9)) + "/2020";
        row['entidad'] = random.choice(entidades)
        row['importe'] = "{:.2f}".format(random.uniform(92, 987))
        rows.append(row)
    
    return {
        'statusCode': '200',
        'body': json.dumps(rows),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
    }
