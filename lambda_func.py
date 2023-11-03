import os,boto3


def lambda_handler(event: any, context:any):
    user = event['user']
    #==no of times i visited this page====
    visit_count:int = 0


    #increment the number of visits
    visit_count += 1
    #create a DynamoDB client
    dynamodb = boto3.resource("dynamodb")
    table_name = os.environ["TABLE_NAME"]

    #table_name = "visit-count-table"
    table = dynamodb.Table(table_name)
    #creating a table object
    #table = dynamodb.Table(table_name)


    #get the current visit count
    response = table.get_item(Key={"user":user})
    if "Item" in response:
        visit_count = response["Item"]["count"]

    visit_count += 1
    #put the new visit count into the table
    table.put_item(Item={"user":user, "count":visit_count})

    message = f"Hello {user}! You have visited this page {visit_count}"
    return {"message":message}

if __name__ == "__main__":
    os.environ['TABLE_NAME'] = 'visit-count-table'
    event = {"user":"bosa"}
    print(lambda_handler(event, None))