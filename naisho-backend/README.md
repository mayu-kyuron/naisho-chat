## 概要

NestJSによるバックエンドアプリです。

## ローカル実行

### 起動方法

```bash
# 開発モード
$ npm run start

# watchモード
$ npm run start:dev

# 本番モード
$ npm run start:prod
```

### テスト
    
Jest    
```bash
$ npm run test

# watchモード
$ npm run test:watch
```

参考）<br>
https://jestjs.io/ja/
<br>
<br>
 
公式
```bash
# 単体テスト
$ npm run test

# e2eテスト
$ npm run test:e2e

# テストカバレッジ
$ npm run test:cov
```

## 新規作成

### インストール
    
```bash
$ npm i -g @nestjs/cli
$ nest -v
```

### プロジェクト作成
    
```bash
$ nest new project-name
```
    
※以下のソースは削除
- src/app.controller.spec.ts
- src/app.service.ts
- （src/app.module.ts の中の、上記のimportと記述を削除）

### module/controller/service作成

```basic
$ nest g module <module_name>

$ nest g controller <controller_name>

# testファイルなしの場合 --no-spec をつける
$ nest g service <service_name> --no-spec
```

### パッケージインストール

- class-validation
```bash
$ npm install --save uuid
$ npm install --save class-validator class-transformer
```

参考）<br>
https://github.com/typestack/class-validator
<br>

- データベース
    
```bash
$ npm install --save @nestjs/typeorm typeorm mysql2
```

- migration

  - 事前準備
  
  ```bash
  $ npm install ts-node --save-dev
  ```
  
  - package.json - scripts　に以下追加（src直下に、ormconfig.ts を作成した場合）
  
  ```json
  "scripts": {
      ...
      "typeorm": "typeorm-ts-node-commonjs -d ./src/ormconfig.ts"
    },
  ```
  
  - src/ormconfig.ts の設定
  
  ```tsx
  import { DataSource } from 'typeorm';
  
  const source = new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'nestjs_test',
    synchronize: true,
    entities: ['src/entities/*.entity.ts'],
    migrations: ['dist/migration/*.js'],
  });
  
  export default source;
  ```
  
  - migration実行
  
  ```bash
  $ npm run typeorm migration:generate ./src/migration/test
  # src/migration/xxxx-test.ts が作成される
  
  # nestjs を実行して、dist/migration/**.js へコンパイルするため
  $ npm run start:dev
  
  $ npm run typeorm -- migration:run
  ```

- パスワードのhash化

```bash
$ npm install --save bcrypt

# 型定義のインストール
$ npm install --save-dev @types/bcrypt
```

- JWT

```bash
$ npm install --save @nestjs/jwt @nestjs/passport passport passport-jwt

# 型定義のインストール
$ npm install --save-dev @types/passport-jwt
```

- eslintとprettierの共存

  - 設定

  ```json
  "scripts": {
      ...
      "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix && prettier --write \"{src,apps,libs,test}/**/*.ts\"",
      ...
    },
  ```

  - 実行

  ```bash
  $ npm run lint
  ```
