# MASKIO

MaskIO Is a data mask library designed for masking sensitive information. In short, it is easy to mask the data.

## Documentation

You can find more details, API, and other docs on [maskio-dev](https://maskio-dev.vercel.app/) website.

## Install

```sh
$ npm add -D maskio
```

## API

```ts
import { maskText, maskObject } from 'maskio';

maskText('1234567890123456', 'bankCard'); // '************3456'

const source = {
  firstCode: '123456',
  otherCode: {
    resultCode: '123',
    name: '小明',
  },
};
const config = { '^.*Code$': 'all', '^otherCode.name$': 'userName' };
maskObject(source, config); // {"firstCode": "******","otherCode": {"resultCode": "***","name": "*明"}}
```

## Star History
[![Star History Chart](https://api.star-history.com/svg?repos=bofengzl/cloud-storage-upload-platform.git,magic-wrangler/maskio.git&type=Date)](https://star-history.com/#bofengzl/cloud-storage-upload-platform.git&magic-wrangler/maskio.git&Date)

## Contributors

Please give us a 💖 star 💖 to support us. Thank you.

And thank you to all our backers! 🙏

## License

maskio is licensed under a [MIT License](LICENSE).
