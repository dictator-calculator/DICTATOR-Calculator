/* DICTATOR - ROUTER: mỗi chức năng là 1 link riêng (#/...), nút Back của trình duyệt quay đúng về trang trước.
   Nạp SAU script chính và tự gọi boot() ở cuối file. */
(()=>{
const R={on:false,init:false},O={},U='([0-9a-f-]{36})';
/* tên hàm -> link */
const H={
  home:()=>'/', allRank:()=>'/xep-hang', giai:()=>'/giai', setTour:id=>'/giai/'+id,
  entryRound:(m,r)=>`/giai/nhap/${r||1}${m?'/'+m:''}`,
  showMap:(id,v)=>'/map/'+id+(v==='top5'?'/top5':''), showHistory:id=>`/map/${id}/lich-su`, showRacer:id=>'/tay-dua/'+id,
  members:()=>'/thanh-vien', entry:m=>'/nhap'+(m?'/'+m:''), addMapView:()=>'/them-map', backups:()=>'/ban-luu',
  editRec:(id,h)=>`/sua/${id}/${h?1:0}`
};
/* link -> hàm + tham số */
const P=[
  ['home',/^\/$/,()=>[]],
  ['allRank',/^\/xep-hang$/,()=>[]],
  ['giai',/^\/giai$/,()=>[]],
  ['setTour',new RegExp(`^/giai/${U}$`),m=>[m[1]]],
  ['entryRound',new RegExp(`^/giai/nhap/(\\d)(?:/${U})?$`),m=>[m[2]||0,+m[1]]],
  ['showMap',new RegExp(`^/map/${U}$`),m=>[m[1],'']],
  ['showMap',new RegExp(`^/map/${U}/top5$`),m=>[m[1],'top5']],
  ['showHistory',new RegExp(`^/map/${U}/lich-su$`),m=>[m[1]]],
  ['showRacer',new RegExp(`^/tay-dua/${U}$`),m=>[m[1]]],
  ['members',/^\/thanh-vien$/,()=>[]],
  ['entry',new RegExp(`^/nhap(?:/${U})?$`),m=>[m[1]]],
  ['addMapView',/^\/them-map$/,()=>[]],
  ['backups',/^\/ban-luu$/,()=>[]],
  ['editRec',new RegExp(`^/sua/${U}/([01])$`),m=>[m[1],+m[2]]]
];
const path=()=>location.hash.slice(1)||'/';
function render(){
  if(typeof me==='undefined'||!me)return;
  const p=path(),r=P.find(x=>x[1].test(p))||P[0],m=p.match(r[1])||[];
  R.on=true;try{O[r[0]](...r[2](m))}finally{R.on=false}
}
function go(h){
  if(R.init)return;
  if(path()===h){render();return}
  history.pushState({d:(history.state&&history.state.d||0)+1},'','#'+h);
  render()
}
/* bọc các hàm điều hướng: bấm chức năng = mở link mới */
[...new Set(P.map(x=>x[0]))].forEach(n=>{O[n]=window[n];window[n]=(...a)=>R.on?O[n](...a):go(H[n](...a))});
/* sau đăng nhập: mở đúng link đang có trên thanh địa chỉ (F5 hoặc dán link vẫn vào đúng trang) */
const S=window.start;
window.start=async u=>{R.init=true;try{await S(u)}finally{R.init=false}render()};
window.addEventListener('popstate',render);
/* nút "← Về ..." = quay lại trang trước trong lịch sử */
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('button');
  if(b&&/^←/.test(b.textContent.trim())&&history.state&&history.state.d>0){e.preventDefault();e.stopPropagation();history.back()}
},true);
if(!history.state)history.replaceState({d:0},'');
boot();
})();
