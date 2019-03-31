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

  const totalMoney = 3000000;

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

enum TAG_KEY {
  라거 = "라거",
  에일 = "에엘",
  람빅 = "람빅",
  국산맥주 = "국산맥주",
  수입맥주 = "수입맥주",
  OB맥주 = "OB맥주",
  필스너 = "필스너",
  IPA = "IPA"
}

const tags: Tag[] = [
  {
    key: TAG_KEY.라거,
    name: "라거"
  },
  {
    key: TAG_KEY.에일,
    name: "에일"
  },
  {
    key: TAG_KEY.람빅,
    name: "람빅"
  },
  {
    key: TAG_KEY.국산맥주,
    name: "국산맥주"
  },
  {
    key: TAG_KEY.수입맥주,
    name: "수입맥주"
  },
  {
    key: TAG_KEY.OB맥주,
    name: "OB맥주"
  },
  {
    key: TAG_KEY.필스너,
    name: "필스너"
  },
  {
    key: TAG_KEY.IPA,
    name: "IPA"
  }
];

const getTagsByKeys = (keys: string[]) =>
  keys.map(key => tags.find(tag => tag.key === key));

const beerData: Beer[] = [
  {
    name: "Cass",
    image:
      "https://s3-ap-southeast-1.amazonaws.com/media.redmart.com/newmedia/1600x/i/m/88005362_0020_1551848697336.jpg",
    tags: getTagsByKeys([TAG_KEY.라거, TAG_KEY.OB맥주]),
    price: 1200,
    stock: 6
  },
  {
    name: "제주에일",
    image:
      "https://d3af5evjz6cdzs.cloudfront.net/images/uploads/800x0/jeju_wit_ale_kor_330ml_eb6dea0739b8a75d665b10f3277121c8.jpg",
    tags: getTagsByKeys([TAG_KEY.국산맥주, TAG_KEY.에일]),
    price: 3600,
    stock: 3
  },
  {
    name: "블랑",
    image: "http://photo.jtbc.joins.com/news/2013/09/24/20130924070203153.jpg",
    tags: getTagsByKeys([TAG_KEY.수입맥주, TAG_KEY.라거]),
    price: 4100,
    stock: 0
  },
  {
    name: "St Louis Premium Framboise",
    image:
      "https://www.wishbeer.com/921-large_default/st-louis-premium-framboise-250-ml-45.jpg",
    tags: getTagsByKeys([TAG_KEY.수입맥주, TAG_KEY.람빅]),
    price: 6000,
    stock: 2
  },
  {
    name: "산미구엘",
    image: "https://cdn.diffords.com/contrib/bws/2017/10/59db8ccf969db.jpg",
    tags: getTagsByKeys([TAG_KEY.수입맥주, TAG_KEY.필스너]),
    price: 2500,
    stock: 10
  },
  {
    name: "코로나",
    image:
      "https://anbl-2.azureedge.net/img/product/11432-B.jpg?fv=F9491D5439915FBA825B3AECDA06A93B-13484",
    tags: getTagsByKeys([TAG_KEY.수입맥주, TAG_KEY.라거]),
    price: 2590,
    stock: 6
  },
  {
    name: "하이네켄",
    image: "http://cphoto.asiae.co.kr/listimglink/1/2014071015010460616_1.jpg",
    tags: getTagsByKeys([TAG_KEY.수입맥주, TAG_KEY.라거]),
    price: 3400,
    stock: 1234
  },
  {
    name: "국민 IPA",
    image:
      "http://img.marieclairekorea.com/2017/12/mck_5a28c532afcc9-562x562.jpg",
    tags: getTagsByKeys([TAG_KEY.국산맥주, TAG_KEY.IPA]),
    price: 5500,
    stock: 3
  },
  {
    name: "버드와이저",
    image: "https://www.wishbeer.com/6852-large_default/budweiser-355-ml-5.jpg",
    tags: getTagsByKeys([TAG_KEY.수입맥주, TAG_KEY.라거]),
    price: 1300,
    stock: 4
  },
  {
    name: "Dry Finish D",
    image:
      "http://www.jcimportco.com/wp-content/uploads/2018/01/Hite-D-Dry-Finish.2.jpg",
    tags: getTagsByKeys([TAG_KEY.국산맥주, TAG_KEY.라거]),
    price: 1400,
    stock: 0
  },
  {
    name: "아사히",
    image:
      "https://img.tesco.com/Groceries/pi/272/8008440249272/IDShot_540x540.jpg",
    tags: getTagsByKeys([TAG_KEY.수입맥주, TAG_KEY.라거]),
    price: 2500,
    stock: 90
  }
];
const beers = beerData.map((beer, idx) => ({ ...beer, id: idx }));
