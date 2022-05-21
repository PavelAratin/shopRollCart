//div внутри корзины, в который мы добавляем товары
const cartWrapper = document.querySelector('.cart-wrapper');
//слушаем событие на всем окне
window.addEventListener('click', function (e) {
  //работа со счетчиком внутри карточки товара
  setCounterCard(e)
  //функция для получения содержимого карточки товара
  getInnerCard(e)

});

//функция для изменения количества товара в карточке
function setCounterCard(e) {
  let counter;
  if (e.target.dataset.action === 'plus' || e.target.dataset.action === 'minus') {
    const counterWrapper = e.target.closest('.counter-wrapper');
    counter = counterWrapper.querySelector('[data-counter]');
  }
  if (e.target.dataset.action === 'plus') {
    counter.innerHTML = ++counter.innerHTML;
  }
  if (e.target.dataset.action === 'minus') {
    if (parseInt(counter.innerText) > 1) {
      counter.innerHTML = --counter.innerHTML;
    } else if (e.target.closest('.cart-wrapper') && parseInt(counter.innerText) === 1) {
      // проверки на товар который находится в корзине
      e.target.closest('.cart-item').remove()
      //функция для отображения статуса корзины пустая/полная
      toggleCartStatus();
      //пересчет общей стоимости товаров в корзине
      calcCartPriceAndDelivery();
    }
  };
  //проверяем клик на плюс или минус внутри корзины
  if (e.target.hasAttribute('data-action') && e.target.closest('.cart-wrapper')) {
    calcCartPriceAndDelivery();
  }
}

//функция для получения содержмого карточки товара
function getInnerCard(e) {
  if (e.target.hasAttribute('data-cart')) {
    const card = e.target.closest('.card');
    //собираем данные найденной карточки в обьект
    const productInfo = {
      id: card.dataset.id,
      imgSrc: card.querySelector('.product-img').getAttribute('src'),
      title: card.querySelector('.item-title').innerText,
      weight: card.querySelector('.price__weight').innerText,
      price: card.querySelector('.price__currency').innerText,
      counter: card.querySelector('[data-counter]').innerText,
      itemsInBox: card.querySelector('[data-items-in-box]').innerText,
    }
    const idNum = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`)
    //функция для проверки есть ли уже такой товар в корзине  
    getIdCardNum(idNum, productInfo, card)
  }
};
//функция для проверки есть ли уже такой товар в корзине и меняем его количество, а не дублируем товар
function getIdCardNum(idNum, productInfo, card) {
  if (idNum) {
    const counterElelement = idNum.querySelector('[data-counter]');
    counterElelement.innerText = parseInt(counterElelement.innerText = parseInt(productInfo.counter))
  } else {
    parcingInCardBasket(productInfo);
  }
  //сбрасываем счетчик на единицу после добавления товара в корзину
  card.querySelector('[data-counter]').innerText = '1';
  //функция для отображения статуса корзины пустая/полная
  toggleCartStatus();
  //пересчет общей стоимости товаров в корзине
  calcCartPriceAndDelivery();
};
//функция для парсинга содержимого карточки в карточку для корзины
function parcingInCardBasket(productInfo) {
  const cartItemHTML = `
  <div class="cart-item" data-id="${productInfo.id}">
  <div class="cart-item__top">
    <div class="cart-item__img">
      <img src="${productInfo.imgSrc}" alt="${productInfo.title}">
    </div>
    <div class="cart-item__desc">
      <div class="cart-item__title">${productInfo.title}</div>
      <div class="cart-item__weight">${productInfo.itemsInBox} / ${productInfo.weight}</div>
      <!-- cart-item__details -->
      <div class="cart-item__details">
        <div class="items items--small counter-wrapper">
          <div class="items__control" data-action="minus">-</div>
          <div class="items__current" data-counter="">${productInfo.counter}</div>
          <div class="items__control" data-action="plus">+</div>
        </div>
        <div class="price">
          <div class="price__currency">${productInfo.price}</div>
        </div>
      </div>
      <!-- // cart-item__details -->
    </div>
  </div>
</div>
`;
  cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML)
};

//функция для отображения статуса корзины пустая/полная
function toggleCartStatus() {
  const cartWrapper = document.querySelector('.cart-wrapper');
  const cartEmptyBage = document.querySelector('[data-cart-empty]');
  const orderForm = document.querySelector('#order-form');
  if (cartWrapper.children.length > 0) {
    cartEmptyBage.classList.add('none');
    orderForm.classList.remove('none');
  } else {
    cartEmptyBage.classList.remove('none');
    orderForm.classList.add('none');
  }
};
//отобрааение цены в корзине и статуса доставки
function calcCartPriceAndDelivery() {
  const cartItems = document.querySelectorAll('.cart-item');
  const totalPriceEl = document.querySelector('.total-price');
  const deliveryCost = document.querySelector('.delivery-cost');
  const cartDelivery = document.querySelector('[data-cart-delivery]');
  let totalPrice = 0;
  cartItems.forEach(function (item) {
    const amountEl = item.querySelector('[data-counter]');
    const priceEl = item.querySelector('.price__currency');
    const currentPrice = parseInt(amountEl.innerText) * parseInt(priceEl.innerText);
    totalPrice += currentPrice;
  });
  //отображаем цену на странице
  totalPriceEl.innerText = totalPrice;

  if (totalPrice > 0) {
    cartDelivery.classList.remove('none');
  } else {
    cartDelivery.classList.add('none');
  }
  if (totalPrice >= 600) {
    deliveryCost.classList.add('free');
    deliveryCost.innerText = 'Бесплатно';
  } else {
    deliveryCost.classList.remove('free');
    deliveryCost.innerText = '250 Р';
  }
};