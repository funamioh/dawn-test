module.exports = {
  ci: {
    collect: {
      url: [
        'https://funamioh-test-store.myshopify.com', // テストしたいURL
      ],
      startServerCommand: 'npm start', // 必要に応じてサーバーを起動するコマンドを指定
      numberOfRuns: 3, // 各URLに対して複数回のテストを実行
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
