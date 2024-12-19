Привет БотХаб!

Я Жалгасов Мерей, вообще я Fullstack, но больше заинтересован в Backend части.

Тестовое задание по фидбеку решил интегрировать в свой недавний проект Adal Zan, можете его тоже проверить. Подумал это даст более широкое понимание моих скиллов.

В проекте работал больше как Backend разработчик (80%/20%)

Презентацию по проекту Adal Zan: https://www.canva.com/design/DAGZwA8ojzs/0o1fmIDUiaqVwpCeuZI3Cw/view?utm_content=DAGZwA8ojzs&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2c75f9a1ca

Сам проект висит на проде, можете тоже чекнуть: https://adalzan.kz/

Есть интеграция ИИ GhatGPT API с отправкой файлов и голосового ввода.
![image](https://github.com/user-attachments/assets/41be6ad7-550b-487e-9bf0-a62f64a7e7bd)


И так теперь по тестовому заданию:

Всё просто:
## Для запуска кода, необходимо сделать
```
  git init
```
```
  git clone git@github.com:vossaglahz/testBotHub.git
```
```
  npm install для server и client отдельно, не стал ultrarunner подключать
```
## server
```
  npm run seed для мок-данных
```
Пароль всех мок-данных: 123456

```
  npm run dev для запуска
```

## client
```
  npm run dev для запуска
```

## .env для server, client отправил отдельно на чате

Есть роль user, lawyer, admin

Сделал так, чтобы создавать и ставить лайки могли только user, так что регайтесь под user (checkbox сверху "Человек" при регистрации)

Все EndPoints на свагерре http://localhost:8000/api/

Чтобы чекнуть через Postman
```
POST /users/login (email, password), оттуда беретe acccesToken и вставляете в Authorization Bearer Token
```
```
GET /feedback для получение всех данных, есть query для сортировки (page, limit, startPeriod, endPeriod, category, votes, status, createdAt)
```
```
POST /feedback/post ({
  "title": "тема",
  "description": "описание",
  "status": "Planned",
  "category": "Functionality"
}) создание поста, стоит middleware validation на authValidate, checkRole('user')
```
```
POST /feedback/vote/:postId (postId и по токену проверяется юзер и id юзера пушет в массив проголосовавших votes) создание поста, стоит middleware validation на authValidate, checkRole('user')
```

totalCount нужен для пагинации 13/5 = получаем 3 страницы

clicked нужен для проверки кликнул ли данный юзер

Если будут вопросы, пишите, готов на всё ответить

Очень надеюсь что сработаемся
