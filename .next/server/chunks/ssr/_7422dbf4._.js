module.exports=[78625,a=>a.a(async(b,c)=>{try{var d=a.i(8171),e=a.i(46283),f=a.i(1257),g=a.i(41910),h=a.i(22016),i=b([h]);[h]=i.then?(await i)():i;let l=e.keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`,m=e.default.div.withConfig({displayName:"Intro__Styled",componentId:"sc-9610e352-0"})`
  background-color: #faf0f1;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 2rem;
  box-sizing: border-box;

  .wrap {
    width: 100%;
    max-width: 1100px;
    height: 85vh;
    min-height: 600px;
    background-color: white;
    border-radius: 20px; /* Highly modern rounded corners */
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08); /* Deep, soft shadow */
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40px 50px;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* --- 1. Top Bar --- */
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: 20;
  }

  .logo-img {
    height: 70px;
    object-fit: contain;
  }

  /* --- 2. Main Center Content --- */
  .center-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    gap: 1.5rem; /* Perfect spacing between text and mascot */
  }

  h1 {
    font-family: var(--font1, 'Arial', sans-serif);
    font-weight: 900;
    font-size: clamp(2.5rem, 4.5vw, 4rem);
    color: #2b7d10;
    line-height: 1.1;
    margin: 0;
    text-align: center;
    letter-spacing: -1px;
    text-shadow: 2px 2px 0px rgba(43, 125, 16, 0.05);
  }

  .tagline {
    font-weight: 700;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    font-family: var(--font2, 'Arial', sans-serif);
    color: #00b4d8;
    margin: 0;
    text-align: center;
  }

  .mascot {
    height: 40vh;
    max-height: 380px;
    object-fit: contain;
    filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.15));
    animation: ${l} 4s ease-in-out infinite;
    z-index: 10;
  }

  /* --- 3. Bottom Button Area --- */
  .bottom-row {
    display: flex;
    justify-content: flex-end; /* Keeps button on the right */
    align-items: flex-end;
    width: 100%;
    z-index: 20;
    padding-top: 20px;
  }

  // .actionBtn {
  //   font-size: 1.5rem;
  //   font-family: var(--font1, sans-serif);
  //   font-weight: bold;
  //   background: linear-gradient(135deg, #00b4d8, #0077b6);
  //   color: white;
  //   padding: 15px 50px;
  //   border-radius: 16px; /* Modern slightly-rounded square */
  //   text-decoration: none;
  //   box-shadow: 0 10px 25px rgba(0, 119, 182, 0.3);
  //   transition: all 0.3s ease;
  //   border: none;
  //   cursor: pointer;
  // }

  // .actionBtn:hover {
  //   transform: translateY(-5px);
  //   box-shadow: 0 15px 30px rgba(0, 119, 182, 0.45);
  //   background: linear-gradient(135deg, #00c4e8, #0096c7);
  // }
  .actionBtn {
    font-size: 1.25rem; /* Reduced from 1.5rem for a cleaner look */
    font-family: var(--font1, sans-serif);
    font-weight: bold;
    background: linear-gradient(135deg, #00b4d8, #0077b6);
    color: white;
    padding: 6px 20px; /* Tighter padding so it's less bulky */
    border-radius: 12px; /* Slightly tighter rounded corners */
    text-decoration: none;
    box-shadow: 0 6px 18px rgba(0, 119, 182, 0.25); /* Softer, smaller shadow */
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }

  .actionBtn:hover {
    transform: translateY(-3px); /* Slightly subtler lift */
    box-shadow: 0 10px 22px rgba(0, 119, 182, 0.4);
    background: linear-gradient(135deg, #00c4e8, #0096c7);
  }

  /* --- 4. Background Icons --- */
  .bg-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .imgIcon {
    position: absolute;
    opacity: 0.8; /* 👈 Brought the opacity back up so they are clearly visible! */
    transform: scale(
      0.9
    ); /* Scales them down slightly so they don't look cramped */
  }
`;var j=[{id:"icon1.png",pos:[{x:450,y:30},{x:110,y:220},{x:920,y:450}]},{id:"icon2.png",pos:[{x:50,y:100},{x:950,y:100},{x:270,y:320}]},{id:"icon3.png",pos:[{x:700,y:20},{x:700,y:350},{x:40,y:350}]},{id:"icon4.png",pos:[{x:830,y:250},{x:20,y:550}]},{id:"icon5.png",pos:[{x:950,y:310},{x:170,y:450}]},{id:"icon6.png",pos:[{x:250,y:80},{x:750,y:500},{x:350,y:500}]}];function k(a){let b=(0,g.useRouter)().basePath||"";return(0,d.jsx)(m,{children:(0,d.jsxs)("div",{className:"wrap",children:[(0,d.jsx)(h.default,{}),(0,d.jsx)("div",{className:"bg-container",children:j.map(a=>(0,d.jsx)("div",{children:a.pos.map(c=>{let e,f;return(0,d.jsx)("img",{className:"imgIcon",src:`${b}/kon/${a.id}`,alt:"",style:(e=c.x,f=c.y,{left:`${e/1100*100}%`,top:`${f/700*100}%`})},`${a.id}-${c.x}-${c.y}`)})},a.id))}),(0,d.jsx)("div",{className:"top-row",children:(0,d.jsx)("img",{className:"logo-img",src:`${b}/img/konzeptes/logo.png`,alt:"logo"})}),(0,d.jsxs)("div",{className:"center-content",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)("h1",{children:"WELCOME TO KONZEPTES!"}),(0,d.jsx)("p",{className:"tagline",children:"Explore our learning modules and improve your language skills."})]}),(0,d.jsx)("img",{className:"mascot",src:`${b}/img/konzeptes/kea.png`,alt:"mascot"})]}),(0,d.jsx)("div",{className:"bottom-row",children:(0,d.jsx)(f.default,{className:"actionBtn",href:"/home",children:"Let's Go"})})]})})}a.s(["default",()=>k]),c()}catch(a){c(a)}},!1),64375,a=>{"use strict";var b=a.i(27669);let c=(...a)=>a.filter((a,b,c)=>!!a&&""!==a.trim()&&c.indexOf(a)===b).join(" ").trim(),d=a=>{let b=a.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,b,c)=>c?c.toUpperCase():b.toLowerCase());return b.charAt(0).toUpperCase()+b.slice(1)};var e={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let f=(0,b.createContext)({}),g=(0,b.forwardRef)(({color:a,size:d,strokeWidth:g,absoluteStrokeWidth:h,className:i="",children:j,iconNode:k,...l},m)=>{let{size:n=24,strokeWidth:o=2,absoluteStrokeWidth:p=!1,color:q="currentColor",className:r=""}=(0,b.useContext)(f)??{},s=h??p?24*Number(g??o)/Number(d??n):g??o;return(0,b.createElement)("svg",{ref:m,...e,width:d??n??e.width,height:d??n??e.height,stroke:a??q,strokeWidth:s,className:c("lucide",r,i),...!j&&!(a=>{for(let b in a)if(b.startsWith("aria-")||"role"===b||"title"===b)return!0;return!1})(l)&&{"aria-hidden":"true"},...l},[...k.map(([a,c])=>(0,b.createElement)(a,c)),...Array.isArray(j)?j:[j]])}),h=(a,e)=>{let f=(0,b.forwardRef)(({className:f,...h},i)=>(0,b.createElement)(g,{ref:i,iconNode:e,className:c(`lucide-${d(a).replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,`lucide-${a}`,f),...h}));return f.displayName=d(a),f};a.s(["default",()=>h],64375)},32660,a=>{"use strict";let b=(0,a.i(64375).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["Eye",()=>b],32660)},20578,a=>{"use strict";let b=(0,a.i(64375).default)("eye-off",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);a.s(["EyeOff",()=>b],20578)},39890,a=>{"use strict";let b=(0,a.i(64375).default)("mail",[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]]);a.s(["Mail",()=>b],39890)},13715,a=>a.a(async(b,c)=>{try{var d=a.i(8171),e=a.i(2093),f=a.i(27669),g=a.i(77068),h=a.i(67507),i=a.i(78625),j=a.i(19059),k=a.i(32660),l=a.i(20578),m=a.i(39890),n=b([h,i]);function o(){let a,[b,c]=(0,f.useState)(!1),[n,o]=(0,f.useState)(!1),[p,q]=(0,f.useState)(!1),[r,s]=(0,f.useState)({email:"",password:"",salutation:"",p_first:"",p_last:"",c_first:"",c_last:"",level:"",mobile:"",package:""});(0,f.useEffect)(()=>{let a=localStorage.getItem("isLoggedIn");"true"===a&&o(!0)},[]),(0,f.useEffect)(()=>{if(n){let a=localStorage.getItem("show_login_popup");"true"===a&&(localStorage.removeItem("show_login_popup"),g.default.fire({html:`
            <div style="padding: 10px; font-family: 'Quicksand', sans-serif;">
              <div style="width: 70px; height: 70px; border: 3px solid #2b7d10; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#2b7d10" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style="color: #2b7d10; font-size: 18px; font-weight: 600; margin: 0;">Login Success!</h3>
            </div>
          `,showConfirmButton:!0,confirmButtonText:"OK",buttonsStyling:!1,width:"380px",background:"#f4f9f4",backdrop:"rgba(0,0,0,0.7)",customClass:{popup:"custom-login-popup",backdrop:"custom-blur-backdrop",confirmButton:"custom-login-btn"}}))}},[n]);let t=a=>s({...r,[a.target.name]:a.target.value}),u=async a=>{a.preventDefault();let d=new FormData(a.target),e=d.get("email"),f=d.get("password");if(!b||/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/.test(f))try{let a=b?h.apiService.register:h.apiService.login,d=b?{salutation:r.salutation,p_first_name:r.p_first,p_last_name:r.p_last,c_first_name:r.c_first,c_last_name:r.c_last,level:r.level,mobile:r.mobile,email:e,password:f,package_type:r.package}:{email:e,password:f},{data:i}=await a(d);"success"===i.status?b?(await g.default.fire({icon:"success",title:"Success!",text:"Registration Successful!",confirmButtonColor:"#33691e"}),c(!1)):(localStorage.setItem("user_id",i.user_id),localStorage.setItem("isLoggedIn","true"),localStorage.setItem("child_name",i.child_name||"Student"),localStorage.setItem("show_login_popup","true"),o(!0)):g.default.fire({icon:"error",text:i.message||"Action Failed",confirmButtonColor:"#33691e"})}catch(a){g.default.fire({icon:"error",text:"Server Connection Error",confirmButtonColor:"#33691e"})}};return n?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(j.default,{children:(0,d.jsx)("title",{className:"jsx-dba856f0369eefff",children:"Konzeptes | Learning App 🎓"})}),(0,d.jsx)(e.default,{id:"dba856f0369eefff",children:".custom-blur-backdrop{-webkit-backdrop-filter:blur(10px)!important;background:#00000073!important}.custom-login-popup{border-radius:16px!important}.custom-login-btn{color:#fff!important;box-shadow:none!important;cursor:pointer!important;background-color:#2b7d10!important;border:none!important;border-radius:8px!important;outline:none!important;margin-top:10px!important;padding:10px 36px!important;font-family:Quicksand,sans-serif!important;font-size:15px!important;font-weight:700!important;transition:all .2s!important}.custom-login-btn:hover,.custom-login-btn:focus{background-color:#1e5c0b!important;outline:none!important;box-shadow:0 4px 12px #2b7d104d!important}"}),(0,d.jsx)(i.default,{})]}):(0,d.jsxs)("div",{className:"auth-page",children:[(0,d.jsx)(j.default,{children:(0,d.jsx)("title",{children:b?"Konzeptes | Register  page ":"Konzeptes | Login Page "})}),(0,d.jsxs)("div",{className:`auth-card-container ${b?"register-mode":"login-mode"}`,children:[(0,d.jsx)("img",{src:"/lms-system/img/konzeptes/logo.png",className:"auth-logo",alt:"Logo"}),(0,d.jsxs)("form",{onSubmit:u,className:"auth-form",children:[b?(0,d.jsxs)("div",{className:"register-section transition-fade",children:[(0,d.jsx)("h2",{className:"auth-title",children:"Create Account"}),(0,d.jsxs)("div",{className:"field-group",children:[(0,d.jsx)("label",{className:"group-label",children:"Parent Details"}),(0,d.jsxs)("div",{className:"registration-grid",children:[(0,d.jsxs)("select",{name:"salutation",required:!0,value:r.salutation,onChange:t,className:"col-4",children:[(0,d.jsx)("option",{value:"",children:"Title"}),(0,d.jsx)("option",{children:"Mr."}),(0,d.jsx)("option",{children:"Mrs."}),(0,d.jsx)("option",{children:"Ms."})]}),(0,d.jsx)("input",{name:"p_first",placeholder:"First Name",required:!0,value:r.p_first,onChange:t,className:"col-4"}),(0,d.jsx)("input",{name:"p_last",placeholder:"Last Name",required:!0,value:r.p_last,onChange:t,className:"col-4"})]})]}),(0,d.jsxs)("div",{className:"field-group",children:[(0,d.jsx)("label",{className:"group-label",children:"Student Details"}),(0,d.jsxs)("div",{className:"registration-grid",children:[(0,d.jsx)("input",{name:"c_first",placeholder:" First Name",required:!0,value:r.c_first,onChange:t,className:"col-4"}),(0,d.jsx)("input",{name:"c_last",placeholder:" Last Name",required:!0,value:r.c_last,onChange:t,className:"col-4"}),(0,d.jsxs)("select",{name:"level",required:!0,value:r.level,onChange:t,className:"col-4",children:[(0,d.jsx)("option",{value:"",children:"Level"}),(0,d.jsx)("option",{value:"easy",children:"Easy"}),(0,d.jsx)("option",{value:"intermediate",children:"Intermediate"}),(0,d.jsx)("option",{value:"hard",children:"Hard"})]})]})]}),(0,d.jsxs)("div",{className:"field-group",children:[(0,d.jsx)("label",{className:"group-label",children:"Account Information"}),(0,d.jsxs)("div",{className:"registration-grid",children:[(0,d.jsxs)("select",{name:"package",required:!0,value:r.package,onChange:t,className:"col-4",children:[(0,d.jsx)("option",{value:"",children:"Package"}),(0,d.jsx)("option",{value:"free",children:"Free"}),(0,d.jsx)("option",{value:"paid",children:"Paid"})]}),(0,d.jsx)("input",{name:"mobile",placeholder:"Mobile",required:!0,value:r.mobile,onChange:t,className:"col-4"}),(0,d.jsx)("input",{name:"email",type:"email",placeholder:"Email",required:!0,value:r.email,onChange:t,className:"col-4"}),(0,d.jsx)("div",{className:"col-12 password-label-container",children:(0,d.jsx)("label",{className:"input-label",children:"Password"})}),(0,d.jsxs)("div",{className:"password-container col-12",children:[(0,d.jsx)("input",{name:"password",type:p?"text":"password",placeholder:"Password",required:!0,value:r.password,onChange:t}),(0,d.jsx)("span",{className:"eye-btn",onClick:()=>q(!p),children:p?(0,d.jsx)(k.Eye,{size:20}):(0,d.jsx)(l.EyeOff,{size:20})})]})]}),r.password&&(a=r.password,!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]\\;':,.\/?]).{1,16}$/.test(a))&&(0,d.jsx)("p",{className:"pass-warning",children:"⚠️ Password Must have Uppercase, Lowercase, Number & Special Char."})]})]}):(0,d.jsxs)("div",{className:"login-section transition-fade",children:[(0,d.jsx)("h2",{className:"auth-title",children:" Login "}),(0,d.jsxs)("div",{className:"input-with-icon full-width-field",children:[(0,d.jsx)("input",{name:"email",type:"email",placeholder:"Email Address",required:!0,value:r.email,onChange:t,autoComplete:"username"}),(0,d.jsx)("span",{className:"input-icon",children:(0,d.jsx)(m.Mail,{size:20})})]}),(0,d.jsxs)("div",{className:"password-container full-width-field",children:[(0,d.jsx)("input",{name:"password",type:p?"text":"password",placeholder:"Password",required:!0,value:r.password,onChange:t,autoComplete:"current-password"}),(0,d.jsx)("span",{className:"eye-btn",onClick:()=>q(!p),children:p?(0,d.jsx)(k.Eye,{size:20}):(0,d.jsx)(l.EyeOff,{size:20})})]})]}),(0,d.jsx)("button",{type:"submit",className:b?"main-submit-btn-register":"main-submit-btn",children:b?"Register Now":"Login !"}),(0,d.jsx)("p",{className:"toggle-view",onClick:()=>c(!b),children:b?"Back to Login":"Create New Account"})]})]})]})}[h,i]=n.then?(await n)():n,a.s(["default",()=>o]),c()}catch(a){c(a)}},!1),71600,a=>a.a(async(b,c)=>{try{var d=a.i(79168),e=a.i(27068),f=a.i(32759),g=a.i(31224),h=a.i(27342),i=a.i(13715),j=a.i(9193),k=b([h,i]);[h,i]=k.then?(await k)():k;let l=(0,f.hoist)(i,"default"),m=(0,f.hoist)(i,"getStaticProps"),n=(0,f.hoist)(i,"getStaticPaths"),o=(0,f.hoist)(i,"getServerSideProps"),p=(0,f.hoist)(i,"config"),q=(0,f.hoist)(i,"reportWebVitals"),r=(0,f.hoist)(i,"unstable_getStaticProps"),s=(0,f.hoist)(i,"unstable_getStaticPaths"),t=(0,f.hoist)(i,"unstable_getStaticParams"),u=(0,f.hoist)(i,"unstable_getServerProps"),v=(0,f.hoist)(i,"unstable_getServerSideProps"),w=new d.PagesRouteModule({definition:{kind:e.RouteKind.PAGES,page:"/index",pathname:"/",bundlePath:"",filename:""},distDir:".next",relativeProjectDir:"",components:{App:h.default,Document:g.default},userland:i}),x=(0,j.getHandler)({srcPage:"/index",config:p,userland:i,routeModule:w,getStaticPaths:n,getStaticProps:m,getServerSideProps:o});a.s(["config",0,p,"default",0,l,"getServerSideProps",0,o,"getStaticPaths",0,n,"getStaticProps",0,m,"handler",0,x,"reportWebVitals",0,q,"routeModule",0,w,"unstable_getServerProps",0,u,"unstable_getServerSideProps",0,v,"unstable_getStaticParams",0,t,"unstable_getStaticPaths",0,s,"unstable_getStaticProps",0,r]),c()}catch(a){c(a)}},!1)];

//# sourceMappingURL=_7422dbf4._.js.map