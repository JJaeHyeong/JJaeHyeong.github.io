const express = require('express');
const mongoose = require('mongoose');

// MongoDB 연결 설정
mongoose.connect('mongodb://localhost/profit-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Failed to connect to MongoDB', error));

// MongoDB 모델 정의
const Record = mongoose.model('Record', {
  username: String,
  purchaseAmount: Number,
  dividendRate: Number,
  purchaseDetails: String
});

// Express 앱 생성
const app = express();

app.use(express.json());

// 수익률 저장 API 엔드포인트
app.post('/api/records', async (req, res) => {
  const { username, purchaseAmount, dividendRate, purchaseDetails } = req.body;

  const record = new Record({
    username,
    purchaseAmount,
    dividendRate,
    purchaseDetails
  });

  try {
    await record.save();
    res.sendStatus(201);
  } catch (error) {
    console.error('Failed to save record', error);
    res.sendStatus(500);
  }
});

// 수익률 가져오기 API 엔드포인트
app.get('/api/records', async (req, res) => {
  try {
    const records = await Record.find();
    res.json(records);
  } catch (error) {
    console.error('Failed to fetch records', error);
    res.sendStatus(500);
  }
});

// 서버 시작
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
