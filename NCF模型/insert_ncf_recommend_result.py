import pandas as pd
import mysql.connector

# 读取 CSV 文件
csv_file_path = 'submission.csv'
df = pd.read_csv(csv_file_path)

# 连接到 MySQL 数据库
conn = mysql.connector.connect(
    host='localhost',  # 数据库主机地址
    port=3306,
    user='root',  # 数据库用户名
    password='zhangqi9029',  # 数据库密码
    database='book_recommend'  # 数据库名
)

cursor = conn.cursor()

truncate_table_query = 'TRUNCATE TABLE ncf_recommend_result'
cursor.execute(truncate_table_query)

# 将 CSV 文件中的内容插入数据库
for _, row in df.iterrows():
    insert_query = '''
    INSERT INTO ncf_recommend_result (user_id, book_id)
    VALUES (%s, %s)
    '''
    cursor.execute(insert_query, tuple(row))

# 提交事务
conn.commit()

# 关闭连接
cursor.close()
conn.close()

print("CSV 文件中的内容已成功写入数据库中。")
