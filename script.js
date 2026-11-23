const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

/* Fourthwall public Storefront API — read-only product catalog */
const FW_TOKEN='ptkn_'+'3274687f-c7b6-4bbd-a3a4-32a72e808669';
const FW_API='https://storefront-api.fourthwall.com/v1';
const FW_SHOP='https://redeemedappreal.com';
const productGrid=document.getElementById('fourthwall-products');
const money=(amount,currency='USD')=>new Intl.NumberFormat('en-US',{style:'currency',currency}).format(amount);
function productCard(product,index){
 const variant=product.variants?.[0];const price=product.type==='BUNDLE'?product.price:variant?.unitPrice;
 const image=product.images?.[0]?.url||variant?.images?.[0]?.url||'';
 const soldOut=product.state?.type==='SOLD_OUT';
 const card=document.createElement('article');card.className='product-card live-product';
 const media=document.createElement('a');media.className='live-product-image';media.href=FW_SHOP+'/products/'+encodeURIComponent(product.slug||'');media.setAttribute('aria-label','View '+product.name);
 if(image){const img=document.createElement('img');img.src=image;img.alt=product.name||'Redeemed product';img.loading='lazy';media.appendChild(img);}else{const fallback=document.createElement('span');fallback.className='product-image-fallback';fallback.textContent='R.';media.appendChild(fallback);}
 const info=document.createElement('div');info.className='product-info live-product-info';const details=document.createElement('div');
 const name=document.createElement('h3');name.textContent=product.name||'Redeemed piece';const priceText=document.createElement('p');priceText.textContent=price?money(price.value,price.currency):'View product';details.append(name,priceText);
 const number=document.createElement('span');number.className='product-index';number.textContent=String(index+1).padStart(2,'0');info.append(details,number);
 const link=document.createElement('a');link.className='text-link';link.href=media.href;link.target='_blank';link.rel='noopener';link.textContent=soldOut?'CURRENTLY UNAVAILABLE':'SHOP THIS PIECE';const arrow=document.createElement('span');arrow.textContent='↗';link.appendChild(arrow);if(soldOut){link.removeAttribute('href');link.setAttribute('aria-disabled','true');}
 card.append(media,info,link);return card;
}
async function loadFourthwallProducts(){
 if(!productGrid)return;
 try{
  const products=[];let page=0;let hasMore=true;
  while(hasMore&&page<20){
   const url=FW_API+'/collections/all/products?storefront_token='+encodeURIComponent(FW_TOKEN)+'&page='+page+'&size=50';
   const response=await fetch(url);if(!response.ok)throw new Error('Fourthwall returned '+response.status);
   const data=await response.json();products.push(...(data.results||[]));hasMore=Boolean(data.paging?.hasNextPage);page++;
  }
  productGrid.replaceChildren();
  const available=products.filter(p=>p.state?.type!=='HIDDEN');
  if(!available.length){const empty=document.createElement('p');empty.className='catalog-status';empty.textContent='The collection is being prepared. Check back soon.';productGrid.append(empty);return;}
  available.forEach((product,index)=>productGrid.appendChild(productCard(product,index)));
 }catch(error){
  console.error('Redeemed catalog could not load:',error);productGrid.replaceChildren();
  const message=document.createElement('p');message.className='catalog-status';message.textContent='The collection could not load right now. Visit the Redeemed store to shop.';productGrid.append(message);
  const link=document.createElement('a');link.className='button button-gold';link.href=FW_SHOP;link.target='_blank';link.rel='noopener';link.textContent='VISIT THE STORE';productGrid.append(link);
 }
}
loadFourthwallProducts();
