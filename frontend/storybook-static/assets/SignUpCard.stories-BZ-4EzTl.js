import{r as n,R as e}from"./iframe-CdBagT6A.js";import{c as y}from"./utils-CpuazSHx.js";import{F as h}from"./HomeIcon-D63-Kg1B.js";import"./preload-helper-PPVm8Dsz.js";function b({title:r,titleId:t,...a},o){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},a),r?n.createElement("title",{id:t},r):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"}))}const k=n.forwardRef(b),f=({role:r,icon:t,title:a,onClick:o,className:p})=>e.createElement("button",{type:"button",role:"button","aria-label":`Select ${a}`,onClick:o,className:y("group flex w-full items-center justify-center gap-3 rounded-lg border-2 border-transparent","bg-property237-primary/10 dark:bg-property237-primary/20 px-6 py-4 text-lg font-bold","text-black dark:text-white transition-all","hover:bg-property237-primary/20 dark:hover:bg-property237-primary/30 hover:border-property237-primary","focus:outline-none focus:ring-2 focus:ring-property237-primary focus:ring-offset-2","focus:ring-offset-background-light dark:focus:ring-offset-background-dark",p)},e.createElement("span",{className:"text-2xl"},t),e.createElement("span",null,a)),u=({onSelectRole:r,loading:t=!1,error:a})=>{const[o,p]=n.useState(!1),[v,x]=n.useState(null),g=l=>{o&&(x(l),r(l))};return e.createElement("div",{className:"bg-background-light dark:bg-background-dark font-display min-h-screen"},e.createElement("div",{className:"flex flex-col min-h-screen"},e.createElement("header",{className:"w-full px-4 sm:px-6 lg:px-8"},e.createElement("div",{className:"container mx-auto flex items-center justify-between py-4 border-b border-property237-primary/20 dark:border-property237-primary/30"},e.createElement("div",{className:"flex items-center gap-2"},e.createElement("svg",{className:"h-6 w-6 text-property237-primary",fill:"none",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},e.createElement("path",{clipRule:"evenodd",d:"M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z",fill:"currentColor",fillRule:"evenodd"})),e.createElement("h1",{className:"text-xl font-bold text-black dark:text-white"},"Property237")))),e.createElement("main",{className:"flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"},e.createElement("div",{className:"w-full max-w-md space-y-8"},e.createElement("div",{className:"text-center"},e.createElement("h2",{className:"text-3xl font-extrabold text-black dark:text-white"},"Join Property237 — Free Sign Up"),e.createElement("p",{className:"mt-2 text-base text-black/60 dark:text-white/60"},"Choose your role to get started.")),e.createElement("div",{className:"bg-white dark:bg-background-dark shadow-xl rounded-xl p-8 space-y-6 border border-property237-primary/10 dark:border-property237-primary/20"},e.createElement("div",{className:"space-y-4"},e.createElement(f,{role:"tenant",icon:e.createElement(h,{className:"h-6 w-6"}),title:"I'm a Tenant",onClick:()=>g("tenant")}),e.createElement(f,{role:"agent",icon:e.createElement(k,{className:"h-6 w-6"}),title:"I'm an Agent",onClick:()=>g("agent")})),e.createElement("div",{className:"flex items-center justify-center"},e.createElement("div",{className:"flex-grow border-t border-property237-primary/20 dark:border-property237-primary/30"}),e.createElement("span",{className:"mx-4 text-sm font-medium text-black/40 dark:text-white/40"},"OR"),e.createElement("div",{className:"flex-grow border-t border-property237-primary/20 dark:border-property237-primary/30"})),e.createElement("div",{className:"text-center"},e.createElement("a",{className:"font-medium text-property237-primary hover:text-property237-primary/80 transition-colors",href:"/login"},"Already have an account? Log in")),e.createElement("div",{className:"flex items-start"},e.createElement("div",{className:"flex h-6 items-center"},e.createElement("input",{className:y("h-4 w-4 rounded border-property237-primary/50 text-property237-primary focus:ring-property237-primary","bg-background-light dark:bg-background-dark dark:border-property237-primary/60","transition-colors"),id:"terms",name:"terms",type:"checkbox",checked:o,onChange:l=>p(l.target.checked)})),e.createElement("div",{className:"ml-3 text-sm"},e.createElement("label",{className:"font-medium text-black/80 dark:text-white/80 cursor-pointer",htmlFor:"terms"},"I agree to the"," ",e.createElement("a",{className:"text-homefinder-primary hover:text-homefinder-primary/80 transition-colors",href:"/terms"},"Terms & Conditions"),"."))),a&&e.createElement("div",{className:"text-center text-sm text-red-600 dark:text-red-400"},a),t&&e.createElement("div",{className:"text-center text-sm text-black/60 dark:text-white/60"},"Processing..."))))))};try{u.displayName="SignUpCard",u.__docgenInfo={description:"",displayName:"SignUpCard",props:{onSelectRole:{defaultValue:null,description:"",name:"onSelectRole",required:!0,type:{name:"(role: UserRole) => void"}},loading:{defaultValue:{value:"false"},description:"",name:"loading",required:!1,type:{name:"boolean"}},error:{defaultValue:null,description:"",name:"error",required:!1,type:{name:"string"}}}}}catch{}const R={title:"Auth/SignUpCard",component:u,parameters:{layout:"fullscreen",docs:{description:{component:"HomeFinder sign-up page with role selection for tenants and agents."}}},tags:["autodocs"]},s={args:{onSelectRole:r=>{console.log(`Selected role: ${r}`)},loading:!1,error:void 0}},c={args:{onSelectRole:r=>{console.log(`Selected role: ${r}`)},loading:!0,error:void 0}},d={args:{onSelectRole:r=>{console.log(`Selected role: ${r}`)},loading:!1,error:"Something went wrong. Please try again."}},i={args:{onSelectRole:r=>{console.log(`Selected role: ${r}`)},loading:!1,error:void 0},parameters:{backgrounds:{default:"dark"}},decorators:[r=>e.createElement("div",{className:"dark"},e.createElement(r,null))]},m={args:{onSelectRole:r=>new Promise(t=>{setTimeout(()=>{alert(`Successfully selected ${r} role!`),t(void 0)},1500)}),loading:!1,error:void 0}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    onSelectRole: role => {
      console.log(\`Selected role: \${role}\`);
    },
    loading: false,
    error: undefined
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    onSelectRole: role => {
      console.log(\`Selected role: \${role}\`);
    },
    loading: true,
    error: undefined
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    onSelectRole: role => {
      console.log(\`Selected role: \${role}\`);
    },
    loading: false,
    error: 'Something went wrong. Please try again.'
  }
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    onSelectRole: role => {
      console.log(\`Selected role: \${role}\`);
    },
    loading: false,
    error: undefined
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  },
  decorators: [Story => <div className="dark">
        <Story />
      </div>]
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    onSelectRole: role => {
      // Simulate a delay and then show success
      return new Promise(resolve => {
        setTimeout(() => {
          alert(\`Successfully selected \${role} role!\`);
          resolve(undefined);
        }, 1500);
      });
    },
    loading: false,
    error: undefined
  }
}`,...m.parameters?.docs?.source}}};const L=["Default","Loading","WithError","DarkMode","Interactive"];export{i as DarkMode,s as Default,m as Interactive,c as Loading,d as WithError,L as __namedExportsOrder,R as default};
