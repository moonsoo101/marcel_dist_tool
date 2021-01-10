import axios from 'axios'
import cheerio from 'cheerio'


async function getHtml() {
  try {
      const res = await axios.get(
      "https://marcel2021.github.io/static/js/photos.js"
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
}

async function getNews() {
  const html = await getHtml();
  const $ = cheerio.load(html);
  let accumulate = {};
  $(".react-photo-gallery--gallery").find("img")
    .each(function (this : cheerio.Element, index, elem) {
        accumulate = $(this).find("dd").text();
    });
    console.log(accumulate)
  return accumulate;
}
export {getNews}