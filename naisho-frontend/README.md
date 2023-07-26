## 概要

Next.jsによるフロントエンドアプリです。

## ローカル実行

### 起動方法

```bash
$ npm run dev
# or
$ yarn dev
# or
$ pnpm dev
```

## 新規作成（React）

### プロジェクト作成

```bash
# my-app というフォルダが自動で作成されるため、プロジェクトのフォルダを手動で作成する必要はない
$ npx create-react-app my-app
$ cd my-app
$ npm run start
```

参考）<br>
https://ja.reactjs.org/docs/create-a-new-react-app.html

## 新規作成（Next.js）

### プロジェクト作成

```bash
$ npx create-next-app@latest --typescript
```

### パッケージインストール

- story book
```bash
$ npx sb@latest init
```

- その他
```bash
# API
$ npm install axios

# yup と formik はセット
$ npm install formik
$ npm install yup

# session管理
$ npm install iron-session

#
$ npm install qs

# React Hooks library for data fetching
$ npm install swr

# github style のCSSテンプレート（sassが読めるよに、事前にsassをインストール）
$ npm install css-loader sass sass-loader style-loader
$ npm install --save-dev @storybook/preset-scss
$ npm install @primer/css

$ npm install --save-dev webpack

# Prettier
$ npm install --save-dev --save-exact prettier

# mui
$ npm install @mui/material @emotion/react @emotion/styled
$ npm install @mui/x-date-pickers

$ npm install date-fns
```
