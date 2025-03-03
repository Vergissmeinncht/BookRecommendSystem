import csv
import mysql.connector

# 连接到 MySQL 数据库
conn = mysql.connector.connect(
    host='localhost',  # 数据库主机地址
    port=3306,
    user='root',  # 数据库用户名
    passwd='zhangqi9029',  # 数据库密码
    database='book_recommend'  # 数据库名
)

# 创建一个 Cursor 对象，用于执行 SQL 语句
cursor = conn.cursor()

# 执行 SQL 查询
cursor.execute('SELECT * FROM book_recommend.browse_record')

# 使用 fetchall() 获取查询结果
results = cursor.fetchall()

# 打印查询结果
csv_file_path = 'C:\\Users\Violet\Desktop\图书推荐系统\图书推荐系统NCF\\train_dataset.csv'
with open(csv_file_path, mode='w', newline='', encoding='utf-8') as csv_file:
    writer = csv.writer(csv_file)
    writer.writerow(['user_id', 'item_id'])  # 写入表头
    for row in results:
        user_id = row[1]  # 假设用户 ID 是第一个字段
        item_id = row[2]
        writer.writerow([user_id,item_id])

cursor.execute('SELECT * FROM book_recommend.borrow_record')

# 使用 fetchall() 获取查询结果
results = cursor.fetchall()

with open(csv_file_path, mode='a', newline='', encoding='utf-8') as csv_file:
    writer = csv.writer(csv_file)
    for row in results:
        user_id = row[1]  # 假设用户 ID 是第一个字段
        item_id = row[2]
        writer.writerow([user_id,item_id])

# 关闭 Cursor 和 Connection 对象
cursor.close()
conn.close()

print(f"用户 ID 已成功写入到 {csv_file_path}")
