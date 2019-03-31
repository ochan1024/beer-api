import bodyParser = require('body-parser')
import * as cors from 'cors'
import * as express from 'express'

const port = 3001;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(function(req, res, next) {
  setTimeout(() => {
    next();
  }, 2000);
});
app.get("/api/beers", (req, res) => res.json(beers));
app.get("/api/tags", (req, res) => res.json(tags));
app.post("/api/purchase", (req, res) => {
  console.log(req.body);
  const purchaseData = req.body as { id: number; count: number }[];
  if (!purchaseData) {
    return res.sendStatus(400);
  }
  const totalPrice = purchaseData.reduce((acc, cur) => {
    const beer = beers.find(({ id }) => id === cur.id);
    return acc + beer.price * cur.count;
  }, 0);
  const totalCount = purchaseData.reduce((acc, cur) => acc + cur.count, 0);

  const totalMoney = 35000;

  if (totalPrice > totalMoney) {
    return res
      .status(400)
      .send({ title: "구매 실패", reason: "잔액이 부족합니다" });
  }

  res.send({ totalPrice, totalCount });
});

app.listen(port, () => console.log(`beer-api listening on port ${port}!`));

interface Beer {
  name: string;
  image: string;
  tags: Tag[];
  price: number;
  stock: number;
}
interface Tag {
  key: string;
  name: string;
}

const tags: Tag[] = [
  {
    key: "라거",
    name: "라거"
  },
  {
    key: "에일",
    name: "에일"
  },
  {
    key: "람빅",
    name: "람빅"
  },
  {
    key: "국산맥주",
    name: "국산맥주"
  },
  {
    key: "수입맥주",
    name: "수입맥주"
  },
  {
    key: "OB맥주",
    name: "OB맥주"
  }
];

const getTagsByKeys = (keys: string[]) =>
  tags.filter(({ key }) => keys.includes(key));

const beerData: Beer[] = [
  {
    name: "Cass",
    image:
      "https://s3-ap-southeast-1.amazonaws.com/media.redmart.com/newmedia/1600x/i/m/88005362_0020_1551848697336.jpg",
    tags: getTagsByKeys(["라거", "OB맥주"]),
    price: 10000,
    stock: 6
  },
  {
    name: "Cass",
    image:
      "https://s3-ap-southeast-1.amazonaws.com/media.redmart.com/newmedia/1600x/i/m/88005362_0020_1551848697336.jpg",
    tags: getTagsByKeys(["국산맥주", "OB맥주"]),
    price: 10000,
    stock: 6
  },
  {
    name: "Cass",
    image:
      "https://s3-ap-southeast-1.amazonaws.com/media.redmart.com/newmedia/1600x/i/m/88005362_0020_1551848697336.jpg",
    tags: getTagsByKeys(["라거", "국산맥주"]),
    price: 10000,
    stock: 6
  },
  {
    name: "Cass",
    image:
      "https://s3-ap-southeast-1.amazonaws.com/media.redmart.com/newmedia/1600x/i/m/88005362_0020_1551848697336.jpg",
    tags: getTagsByKeys(["라거", "국산맥주", "OB맥주"]),
    price: 10000,
    stock: 6
  },
  {
    name: "Cass",
    image:
      "https://s3-ap-southeast-1.amazonaws.com/media.redmart.com/newmedia/1600x/i/m/88005362_0020_1551848697336.jpg",
    tags: getTagsByKeys(["라거", "국산맥주", "OB맥주"]),
    price: 10000,
    stock: 6
  },
  {
    name: "Cass",
    image:
      "https://s3-ap-southeast-1.amazonaws.com/media.redmart.com/newmedia/1600x/i/m/88005362_0020_1551848697336.jpg",
    tags: getTagsByKeys(["라거", "국산맥주", "OB맥주"]),
    price: 10000,
    stock: 6
  }
];
const beers = beerData.map((beer, idx) => ({ ...beer, id: idx }));
