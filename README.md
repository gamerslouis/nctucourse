# 交大課程助理
交大學生自製的模擬排課系統，提供了模擬排課、課表圖片匯出、GPA計算機、空堂通識搜尋等功能
![image](https://github.com/gamerslouis/nctucourse/blob/master/frontend/public/og.png)
## TODO
- [X] 課程爬蟲
- [X] 基本模擬排課
- [X] 課表匯出
- [ ] 課表分享
- [X] 空堂查詢
- [X] 修課紀錄匯入 / GPA 計算機
- [ ] 自動化部署腳本優化

## Setup development environment
Require nodejs v16 and python3

1. clone project
    ```
    git clone https://github.com/gamerslouis/nctucourse
    git clone https://github.com/gamerslouis/nctucourse -b <branch name>
    ```

2. install frontend dependencies
    ```
    cd nctucourse/frontend
    yarn
    ```

3. install backend dependencies
    ```
    cd nctucourse/backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python3 manager.py migrate
    ```

4. setup nycu oauth
    - Go to https://id.nycu.edu.tw/apply/app/
    - Create new application
    - Name what you like e.g. nctucourse_test
    - Select client type `Public`, authorization grant type `Authorization code`
    - Type redirect uris `http://127.0.0.1:8000/api/accounts/login/nycu`
    - Next until finish create
    - Create a file nctucourse/backend/.env
    ```
    NYCU_OAUTH_CLIENT_ID=<client id from the website>
    NYCU_OAUTH_CLIENT_SECRET=<client secret from the website>
    ```

5. start both frontend and backend
   
   Start frontend may take a lot of time. You should wait until `Starting the development server...` appear and then disappear
   ```
   cd nctucourse/frontent
   yarn start
   ```
   ```
   cd nctucourse/backend
   source venv/bin/activate
   python3 manage.py runserver
   ```

6. Start crawler to collect course data
   ```
   cd nctucourse/backend
   source venv/bin/activate
   cd ../crawler
   python3 main.py -s 1102 -t course
   ```
