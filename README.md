
# Ссылка на скрины:
https://monosnap.com/file/sGtTL7fNPeQGI2KHGVwDo6HPMMPJzn

# node-hw-goit
Запусти команды в терминале и сделай отдельный скриншот результата выполнения каждой команды.

# Получаем и выводим весь список контакстов в виде таблицы (console.table)
node index.js --action="list"

# Получаем контакт по id
node index.js --action="get" --id=5

# Добавялем контакт
node index.js --action="add" --name="Mango" --email="mango@gmail.com" --phone="322-22-22"

# Удаляем контакт
node index.js --action="remove" --id=3
