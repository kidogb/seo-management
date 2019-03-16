import { parse } from 'url';

// mock tableListDataSource
let productList = [];
for (let i = 0; i< 20; i+=1) {
  productList.push ({
    id: i,
    ps_category_list_id: `13208${i}`,
    ps_product_name: 'Túi đeo chéo nữ Hàn Quốc da PU vintage hoạ tiết đường chỉ nữ tính, khóa vặn tiện dụng, dây đeo da bản nhỏ',
    ps_product_description: ' 💎 Cam kết công bố đúng chất lượng sản phẩm :v \n👉 KHÁCH ĐÁNH GIÁ 5* sẽ được giảm giá và miễn phí vận chuyển lần mua hang tiếp theo.*\n👌🏻 100% có ảnh thật tự chụp.\n 🚛 Ship hàng COD toàn quốc, Nhận hàng mới trả tiền\n👉 Lổi đổi mới ( Đổi trả hàng, hoàn tiền theo quy định của shopee. Inbox shop hỗ trợ)\n❤️ Chúng tôi luôn lắng nghe đóng góp của bạn để hoàn thiện hơn, vui long inbox shopee chat & call khi có nhu cầu.\n\n---------------------------------------------\n🏠 THỜI TRANG NỮ ZORO STORE\n55 - Nguyễn Trãi - P.Hùng Vương - Tp Phúc Yên - Vĩnh Phúc\n☎️Hotline: 032.999.79.79 ( Zalo/ /Imessage/Shopee chat)\nCảm ơn bạn đã quan tâm đến sản phẩm của ZORO. Chúc bạn có trải nghiệm mua sắm vui vẻ\n',
    ps_price: '200000.00',
    ps_stock: 43,
    ps_product_weight: 500,
    ps_days_to_ship: 2,
    channel_50012_switch: 'Mở',
    channel_50011_switch: 'Mở',
    channel_50016_switch: 'Mở',
    channel_50015_switch: 'Mở',
    channel_50010_switch: 'Mở',
    ps_imgs : [
      {id: 208,
      title: "",
      file: "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      note: null
      },
      {id: 209,
        title: "",
        file: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        note: null
      },
      {id: 210,
        title: "",
        file: "https://images.pexels.com/photos/1319911/pexels-photo-1319911.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        note: null
      },
      {id: 211,
        title: "",
        file: "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        note: null
      },
    ],
    sample: null
  });
}

function getProduct(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = productList;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    count: 20,
    next: "http://localhost:3000/commonapis/products/?page=2",
    previous: null,
    results: dataSource,
  };
  return res.json(result);
}
function getProductDetail(req, res, u) { 
  const result = productList[0];
  return res.json(result);
}

function postRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  return getRule(req, res, u);
}

export default {
  'POST /api/rule': postRule,
  'GET /commonapis/product': getProduct,
  'GET /commonapis/product/44': getProductDetail,
};
