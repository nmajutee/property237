import{r as n,R as e}from"./iframe-CdBagT6A.js";import{B as ge}from"./Button-BL5Af1AR.js";import{F as ee,B as Te}from"./Badge-aPpeW45n.js";import{u as he,b as Me,F as Q,a as P}from"./useClickOutside-CQ6WrNY9.js";import{F as Ve,a as te}from"./MapPinIcon-B0yqunG-.js";import{F as Ie}from"./HomeIcon-D63-Kg1B.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CpuazSHx.js";import"./Icon-CfZfxJJJ.js";import"./index-Ajz5TMfm.js";function Oe({title:a,titleId:o,...l},y){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:y,"aria-labelledby":o},l),a?n.createElement("title",{id:o},a):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"}))}const ye=n.forwardRef(Oe);function $e({title:a,titleId:o,...l},y){return n.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:y,"aria-labelledby":o},l),a?n.createElement("title",{id:o},a):null,n.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"}))}const Be=n.forwardRef($e),_=({value:a="",onChange:o,onSearch:l,placeholder:y="Search properties, locations, tenants...",suggestions:p=[],recentSearches:d=[],filterGroups:w=[],filters:x={},onFilterChange:u,onClearRecentSearches:b,loading:re=!1,disabled:fe=!1,showSuggestions:z=!0,showFilters:ae=!0,autoFocus:se=!1,debounceDelay:ne=300,maxSuggestions:oe=8,maxRecentSearches:K=5,className:be=""})=>{const[Se,F]=n.useState(a),[ve,U]=n.useState(x),[le,m]=n.useState(!1),[J,ie]=n.useState(!1),[S,N]=n.useState(-1),[Z,we]=n.useState(null),g=n.useRef(null),ce=n.useRef(null),ue=n.useRef(null),h=a!==void 0?a:Se,f=Object.keys(x).length>0?x:ve;he(ce,()=>m(!1)),he(ue,()=>ie(!1)),n.useEffect(()=>{se&&g.current&&g.current.focus()},[se]);const xe=n.useCallback(t=>{Z&&clearTimeout(Z);const r=setTimeout(()=>{l&&l(t,f)},ne);we(r)},[l,f,ne,Z]),ke=t=>{const r=t.target.value;o?o(r):F(r),z&&r.trim()?(m(!0),N(-1)):m(!1),r.trim()&&xe(r.trim())},Ee=()=>{z&&(h.trim()||d.length>0)&&m(!0)},de=t=>{t.preventDefault();const r=h.trim();r&&l&&l(r,f),m(!1),g.current?.blur()},me=t=>{const r=t.title;o?o(r):F(r),l&&l(r,f),m(!1),g.current?.focus()},pe=t=>{const r=t.query;o?o(r):F(r),u?u(t.filters):U(t.filters),l&&l(r,t.filters),m(!1),g.current?.focus()},Fe=t=>{if(!le)return;const r=Math.min(p.length,oe)+(d.length>0?Math.min(d.length,K):0);switch(t.key){case"ArrowDown":t.preventDefault(),N(i=>i<r-1?i+1:0);break;case"ArrowUp":t.preventDefault(),N(i=>i>0?i-1:r-1);break;case"Enter":if(t.preventDefault(),S>=0){const i=Math.min(d.length,K);if(S<i)pe(d[S]);else{const s=S-i;s<p.length&&me(p[s])}}else de(t);break;case"Escape":m(!1),N(-1),g.current?.blur();break}},D=(t,r)=>{const i={...f,[t]:r};(r==null||r===""||Array.isArray(r)&&r.length===0)&&delete i[t],u?u(i):U(i),l&&h.trim()&&l(h.trim(),i)},Ne=()=>{o?o(""):F(""),m(!1),g.current?.focus()},X=Object.keys(f).length,De=t=>{const r=f[t.id];switch(t.type){case"select":return e.createElement("select",{value:r||"",onChange:s=>D(t.id,s.target.value),className:"w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"},e.createElement("option",{value:""},"All ",t.label),t.options?.map(s=>e.createElement("option",{key:s.id,value:s.value},s.label," ",s.count!==void 0&&`(${s.count})`)));case"multiselect":const i=Array.isArray(r)?r:[];return e.createElement("div",{className:"space-y-2"},t.options?.map(s=>e.createElement("label",{key:s.id,className:"flex items-center gap-2"},e.createElement("input",{type:"checkbox",checked:i.includes(s.value),onChange:Ae=>{const qe=Ae.target.checked?[...i,s.value]:i.filter(Ce=>Ce!==s.value);D(t.id,qe)},className:"rounded border-gray-300 text-blue-600 focus:ring-blue-500"}),e.createElement("span",{className:"text-sm text-gray-700 dark:text-gray-300"},s.label," ",s.count!==void 0&&`(${s.count})`))));case"range":return e.createElement("div",{className:"space-y-2"},e.createElement("div",{className:"flex items-center gap-2"},e.createElement("input",{type:"number",placeholder:"Min",min:t.min,max:t.max,step:t.step,value:r?.min||"",onChange:s=>D(t.id,{...r,min:s.target.value?Number(s.target.value):void 0}),className:"w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"}),e.createElement("span",{className:"text-gray-500"},"to"),e.createElement("input",{type:"number",placeholder:"Max",min:t.min,max:t.max,step:t.step,value:r?.max||"",onChange:s=>D(t.id,{...r,max:s.target.value?Number(s.target.value):void 0}),className:"w-full rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm"})));default:return null}},Re=t=>{const r=t.icon||(t.type==="property"?Q:t.type==="location"?te:t.type==="tenant"?P:t.type==="recent"?ye:ee);return e.createElement(r,{className:"h-4 w-4 text-gray-400"})},Y=p.slice(0,oe),k=d.slice(0,K);return e.createElement("div",{className:`relative w-full max-w-2xl ${be}`},e.createElement("form",{onSubmit:de,className:"relative"},e.createElement("div",{className:"relative"},e.createElement("input",{ref:g,type:"text",value:h,onChange:ke,onFocus:Ee,onKeyDown:Fe,placeholder:y,disabled:fe,className:"w-full pl-12 pr-20 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"}),e.createElement("div",{className:"absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"},re?e.createElement("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"}):e.createElement(ee,{className:"h-4 w-4 text-gray-400"})),e.createElement("div",{className:"absolute inset-y-0 right-0 flex items-center gap-1 pr-2"},h&&e.createElement(ge,{type:"button",variant:"ghost",size:"sm",onClick:Ne,className:"p-1.5"},e.createElement(Me,{className:"h-4 w-4"})),ae&&w.length>0&&e.createElement(ge,{type:"button",variant:"ghost",size:"sm",onClick:()=>ie(!J),className:`p-1.5 relative ${J?"bg-gray-100 dark:bg-gray-800":""}`},e.createElement(Ve,{className:"h-4 w-4"}),X>0&&e.createElement(Te,{variant:"primary",size:"sm",className:"absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"},X))))),le&&z&&e.createElement("div",{ref:ce,className:"absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-y-auto"},k.length>0&&e.createElement("div",{className:"p-3 border-b border-gray-100 dark:border-gray-700"},e.createElement("div",{className:"flex items-center justify-between mb-2"},e.createElement("span",{className:"text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"},"Recent Searches"),b&&e.createElement("button",{onClick:b,className:"text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"},"Clear")),e.createElement("div",{className:"space-y-1"},k.map((t,r)=>e.createElement("button",{key:`recent-${r}`,onClick:()=>pe(t),className:`
                      w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors
                      ${r===S?"bg-blue-50 dark:bg-blue-900/20":"hover:bg-gray-50 dark:hover:bg-gray-700"}
                    `},e.createElement(ye,{className:"h-4 w-4 text-gray-400 flex-shrink-0"}),e.createElement("div",{className:"flex-1 min-w-0"},e.createElement("div",{className:"text-sm font-medium text-gray-900 dark:text-white truncate"},t.query),Object.keys(t.filters).length>0&&e.createElement("div",{className:"flex items-center gap-1 mt-1"},e.createElement(Be,{className:"h-3 w-3 text-gray-400"}),e.createElement("span",{className:"text-xs text-gray-500 dark:text-gray-400"},Object.keys(t.filters).length," filters applied"))))))),Y.length>0&&e.createElement("div",{className:"p-3"},k.length>0&&e.createElement("span",{className:"text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block"},"Suggestions"),e.createElement("div",{className:"space-y-1"},Y.map((t,r)=>{const i=r+k.length;return e.createElement("button",{key:t.id,onClick:()=>me(t),className:`
                        w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors
                        ${i===S?"bg-blue-50 dark:bg-blue-900/20":"hover:bg-gray-50 dark:hover:bg-gray-700"}
                      `},Re(t),e.createElement("div",{className:"flex-1 min-w-0"},e.createElement("div",{className:"text-sm font-medium text-gray-900 dark:text-white truncate"},t.title),t.subtitle&&e.createElement("div",{className:"text-xs text-gray-500 dark:text-gray-400 truncate"},t.subtitle)))}))),Y.length===0&&k.length===0&&h.trim()&&e.createElement("div",{className:"p-6 text-center"},e.createElement(ee,{className:"h-8 w-8 text-gray-400 mx-auto mb-2"}),e.createElement("p",{className:"text-sm text-gray-500 dark:text-gray-400"},'No suggestions found for "',h,'"'))),J&&ae&&w.length>0&&e.createElement("div",{ref:ue,className:"absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-y-auto"},e.createElement("div",{className:"p-4"},e.createElement("div",{className:"flex items-center justify-between mb-4"},e.createElement("h3",{className:"text-sm font-medium text-gray-900 dark:text-white"},"Filters"),X>0&&e.createElement("button",{onClick:()=>{u?u({}):U({})},className:"text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"},"Clear All")),e.createElement("div",{className:"space-y-4"},w.map(t=>e.createElement("div",{key:t.id},e.createElement("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"},t.label),De(t)))))))};try{_.displayName="SearchBar",_.__docgenInfo={description:"",displayName:"SearchBar",props:{value:{defaultValue:{value:""},description:"Current search query",name:"value",required:!1,type:{name:"string"}},onChange:{defaultValue:null,description:"Search query change handler",name:"onChange",required:!1,type:{name:"((query: string) => void)"}},onSearch:{defaultValue:null,description:"Search submission handler",name:"onSearch",required:!1,type:{name:"((query: string, filters: SearchFilter) => void)"}},placeholder:{defaultValue:{value:"Search properties, locations, tenants..."},description:"Placeholder text",name:"placeholder",required:!1,type:{name:"string"}},suggestions:{defaultValue:{value:"[]"},description:"Search suggestions",name:"suggestions",required:!1,type:{name:"SearchSuggestion[]"}},recentSearches:{defaultValue:{value:"[]"},description:"Recent searches",name:"recentSearches",required:!1,type:{name:"SearchResult[]"}},filterGroups:{defaultValue:{value:"[]"},description:"Filter groups",name:"filterGroups",required:!1,type:{name:"FilterGroup[]"}},filters:{defaultValue:{value:"{}"},description:"Current filters",name:"filters",required:!1,type:{name:"SearchFilter"}},onFilterChange:{defaultValue:null,description:"Filter change handler",name:"onFilterChange",required:!1,type:{name:"((filters: SearchFilter) => void)"}},onClearRecentSearches:{defaultValue:null,description:"Clear recent searches handler",name:"onClearRecentSearches",required:!1,type:{name:"(() => void)"}},loading:{defaultValue:{value:"false"},description:"Loading state",name:"loading",required:!1,type:{name:"boolean"}},disabled:{defaultValue:{value:"false"},description:"Disabled state",name:"disabled",required:!1,type:{name:"boolean"}},showSuggestions:{defaultValue:{value:"true"},description:"Show suggestions dropdown",name:"showSuggestions",required:!1,type:{name:"boolean"}},showFilters:{defaultValue:{value:"true"},description:"Show filters",name:"showFilters",required:!1,type:{name:"boolean"}},autoFocus:{defaultValue:{value:"false"},description:"Auto-focus on mount",name:"autoFocus",required:!1,type:{name:"boolean"}},debounceDelay:{defaultValue:{value:"300"},description:"Debounce delay for search (ms)",name:"debounceDelay",required:!1,type:{name:"number"}},maxSuggestions:{defaultValue:{value:"8"},description:"Maximum suggestions to show",name:"maxSuggestions",required:!1,type:{name:"number"}},maxRecentSearches:{defaultValue:{value:"5"},description:"Maximum recent searches to show",name:"maxRecentSearches",required:!1,type:{name:"number"}},className:{defaultValue:{value:""},description:"Additional CSS classes",name:"className",required:!1,type:{name:"string"}}}}}catch{}const Ue={title:"Composite/SearchBar",component:_,parameters:{layout:"centered",docs:{description:{component:`
The SearchBar component provides advanced search functionality with:

- **Smart Suggestions**: Real-time search suggestions with icons and categories
- **Recent Searches**: History of previous searches with filters
- **Advanced Filters**: Multiple filter types (select, multiselect, range, checkbox)
- **Keyboard Navigation**: Full keyboard support with arrow keys and Enter
- **Debounced Search**: Optimized search performance with configurable delay
- **Responsive Design**: Mobile-friendly with touch support

## Features

### Search Functionality
- Real-time search with debouncing
- Custom search suggestions with icons
- Recent search history with filter restoration
- Form submission handling

### Filter System
- Multiple filter types: select, multiselect, range, checkbox
- Visual filter count badges
- Clear all filters functionality
- Persistent filter state

### User Experience
- Keyboard navigation (arrows, enter, escape)
- Click outside to close dropdowns
- Loading states and disabled support
- Auto-focus option

### Accessibility
- Full keyboard navigation
- Screen reader compatible
- Proper ARIA labels and semantics
- Focus management
        `}}},argTypes:{value:{control:"text",description:"Current search query value"},placeholder:{control:"text",description:"Search input placeholder text"},loading:{control:"boolean",description:"Show loading state in search icon"},disabled:{control:"boolean",description:"Disable the search input"},showSuggestions:{control:"boolean",description:"Enable search suggestions dropdown"},showFilters:{control:"boolean",description:"Enable filters dropdown"},autoFocus:{control:"boolean",description:"Auto-focus search input on mount"},debounceDelay:{control:{type:"number",min:0,max:2e3,step:100},description:"Debounce delay for search in milliseconds"},maxSuggestions:{control:{type:"number",min:1,max:20,step:1},description:"Maximum number of suggestions to show"},maxRecentSearches:{control:{type:"number",min:1,max:10,step:1},description:"Maximum number of recent searches to show"}}},v=[{id:"1",title:"Sunset Apartments",subtitle:"123 Main St, Downtown - 24 units",type:"property",icon:Q},{id:"2",title:"Oak Ridge Condos",subtitle:"456 Oak Ave, Midtown - 48 units",type:"property",icon:Q},{id:"3",title:"Downtown",subtitle:"City district with 156 properties",type:"location",icon:te},{id:"4",title:"John Smith",subtitle:"Tenant at Sunset Apartments, Unit A-101",type:"tenant",icon:P},{id:"5",title:"Alice Johnson",subtitle:"Tenant at Oak Ridge Condos, Unit B-205",type:"tenant",icon:P},{id:"6",title:"Apartment",subtitle:"89 properties available",type:"category",icon:Ie},{id:"7",title:"Metro District",subtitle:"Business district with 42 properties",type:"location",icon:te},{id:"8",title:"Sarah Wilson",subtitle:"Tenant at Pine Valley Houses, Unit 7",type:"tenant",icon:P}],W=[{id:"propertyType",label:"Property Type",type:"select",options:[{id:"apartment",label:"Apartment Complex",value:"apartment",count:45},{id:"condo",label:"Condominium",value:"condominium",count:32},{id:"house",label:"Single Family",value:"house",count:28},{id:"loft",label:"Loft",value:"loft",count:15},{id:"townhouse",label:"Townhouse",value:"townhouse",count:12}]},{id:"location",label:"Location",type:"multiselect",options:[{id:"downtown",label:"Downtown",value:"downtown",count:67},{id:"midtown",label:"Midtown",value:"midtown",count:43},{id:"suburb",label:"Suburban",value:"suburban",count:38},{id:"riverside",label:"Riverside",value:"riverside",count:22},{id:"metro",label:"Metro District",value:"metro",count:19}]},{id:"rentRange",label:"Rent Range",type:"range",min:500,max:5e3,step:50},{id:"amenities",label:"Amenities",type:"multiselect",options:[{id:"parking",label:"Parking",value:"parking",count:89},{id:"pool",label:"Swimming Pool",value:"pool",count:34},{id:"gym",label:"Fitness Center",value:"gym",count:28},{id:"laundry",label:"Laundry Facility",value:"laundry",count:67},{id:"balcony",label:"Balcony/Patio",value:"balcony",count:52}]}],E=[{query:"downtown apartments",filters:{propertyType:"apartment",location:["downtown"]},timestamp:new Date("2024-01-15T10:30:00")},{query:"sunset",filters:{},timestamp:new Date("2024-01-15T09:15:00")},{query:"luxury condos",filters:{propertyType:"condominium",rentRange:{min:2e3}},timestamp:new Date("2024-01-14T16:45:00")},{query:"pool amenities",filters:{amenities:["pool","gym"]},timestamp:new Date("2024-01-14T14:20:00")},{query:"john smith tenant",filters:{},timestamp:new Date("2024-01-13T11:30:00")}],c={args:{placeholder:"Search properties, locations, tenants...",suggestions:v,recentSearches:E,filterGroups:W,showSuggestions:!0,showFilters:!0,debounceDelay:300,maxSuggestions:6,maxRecentSearches:3}},R={args:{...c.args,loading:!0,value:"searching..."}},A={args:{...c.args,disabled:!0,value:"This search is disabled"}},q={args:{...c.args,showSuggestions:!1}},C={args:{...c.args,showFilters:!1}},T={args:{placeholder:"Search...",showSuggestions:!1,showFilters:!1}},M={args:{placeholder:"Search properties by name, address, or type...",suggestions:v.filter(a=>a.type==="property"),filterGroups:W.filter(a=>["propertyType","rentRange"].includes(a.id)),recentSearches:E.filter(a=>a.query.includes("apartment")||a.query.includes("condo")),showSuggestions:!0,showFilters:!0,maxSuggestions:8,maxRecentSearches:5}},V={args:{placeholder:"Search by location, district, or neighborhood...",suggestions:v.filter(a=>a.type==="location"),filterGroups:W.filter(a=>a.id==="location"),recentSearches:E.filter(a=>a.query.includes("downtown")),showSuggestions:!0,showFilters:!0}},I={args:{placeholder:"Search tenants by name or contact information...",suggestions:v.filter(a=>a.type==="tenant"),filterGroups:[],recentSearches:E.filter(a=>a.query.includes("tenant")),showSuggestions:!0,showFilters:!1}},O={args:{...c.args,autoFocus:!0},parameters:{docs:{description:{story:"SearchBar automatically focuses when the component mounts, useful for search pages or modal dialogs."}}}},$={args:{...c.args,debounceDelay:100},parameters:{docs:{description:{story:"Reduced debounce delay for more responsive search, useful for local data searching."}}}},B={args:{...c.args,debounceDelay:1e3},parameters:{docs:{description:{story:"Increased debounce delay to reduce API calls, useful for expensive search operations."}}}},j={args:{...c.args,maxSuggestions:12,suggestions:[...v,...Array.from({length:8},(a,o)=>({id:`extra-${o}`,title:`Property ${o+9}`,subtitle:`Address ${o+9}, District ${o+1}`,type:"property",icon:Q}))]}},L={render:()=>{const[a,o]=n.useState(""),[l,y]=n.useState({}),[p,d]=n.useState([...E]),w=(u,b)=>{console.log("Search:",{query:u,filters:b}),d([{query:u,filters:b,timestamp:new Date},...p.slice(0,4)]),alert(`Searching for: "${u}" with ${Object.keys(b).length} filters`)},x=()=>{d([]),console.log("Search history cleared")};return e.createElement("div",{className:"w-full max-w-2xl"},e.createElement(_,{value:a,onChange:o,onSearch:w,suggestions:v,recentSearches:p,filterGroups:W,filters:l,onFilterChange:y,onClearRecentSearches:x,placeholder:"Try searching and using filters..."}),e.createElement("div",{className:"mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"},e.createElement("div",null,e.createElement("strong",null,"Query:")," ",a||"None"),e.createElement("div",null,e.createElement("strong",null,"Active Filters:")," ",Object.keys(l).length||"None"),e.createElement("div",null,e.createElement("strong",null,"Recent Searches:")," ",p.length),Object.keys(l).length>0&&e.createElement("div",{className:"mt-2"},e.createElement("strong",null,"Filter Details:"),e.createElement("pre",{className:"mt-1 text-xs"},JSON.stringify(l,null,2)))))},parameters:{docs:{description:{story:"Interactive example with full state management, search history, and filter persistence. Open the console to see search events."}}}},H={args:c.args,parameters:{docs:{description:{story:`
### Accessibility Features Demonstrated:

1. **Keyboard Navigation**:
   - Tab to focus search input
   - Arrow keys to navigate suggestions
   - Enter to select or submit
   - Escape to close dropdowns

2. **Screen Reader Support**:
   - Semantic HTML structure
   - ARIA labels for icons and buttons
   - Proper form associations

3. **Focus Management**:
   - Visible focus indicators
   - Logical tab order
   - Focus retention after interactions

4. **Visual Accessibility**:
   - High contrast colors
   - Clear visual hierarchy
   - Icon + text combinations

Try navigating this example using only the keyboard to experience the full accessibility support.
        `}}}},G={args:c.args,parameters:{backgrounds:{default:"dark"},docs:{description:{story:"SearchBar automatically adapts to dark mode with proper contrast and visibility."}}},decorators:[a=>e.createElement("div",{className:"dark"},e.createElement("div",{className:"bg-gray-900 p-6 rounded-lg"},e.createElement(a,null)))]};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search properties, locations, tenants...',
    suggestions: sampleSuggestions,
    recentSearches: sampleRecentSearches,
    filterGroups: sampleFilterGroups,
    showSuggestions: true,
    showFilters: true,
    debounceDelay: 300,
    maxSuggestions: 6,
    maxRecentSearches: 3
  }
}`,...c.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    loading: true,
    value: 'searching...'
  }
}`,...R.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    disabled: true,
    value: 'This search is disabled'
  }
}`,...A.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showSuggestions: false
  }
}`,...q.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showFilters: false
  }
}`,...C.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search...',
    showSuggestions: false,
    showFilters: false
  }
}`,...T.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search properties by name, address, or type...',
    suggestions: sampleSuggestions.filter(s => s.type === 'property'),
    filterGroups: sampleFilterGroups.filter(f => ['propertyType', 'rentRange'].includes(f.id)),
    recentSearches: sampleRecentSearches.filter(r => r.query.includes('apartment') || r.query.includes('condo')),
    showSuggestions: true,
    showFilters: true,
    maxSuggestions: 8,
    maxRecentSearches: 5
  }
}`,...M.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search by location, district, or neighborhood...',
    suggestions: sampleSuggestions.filter(s => s.type === 'location'),
    filterGroups: sampleFilterGroups.filter(f => f.id === 'location'),
    recentSearches: sampleRecentSearches.filter(r => r.query.includes('downtown')),
    showSuggestions: true,
    showFilters: true
  }
}`,...V.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search tenants by name or contact information...',
    suggestions: sampleSuggestions.filter(s => s.type === 'tenant'),
    filterGroups: [],
    recentSearches: sampleRecentSearches.filter(r => r.query.includes('tenant')),
    showSuggestions: true,
    showFilters: false
  }
}`,...I.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    autoFocus: true
  },
  parameters: {
    docs: {
      description: {
        story: 'SearchBar automatically focuses when the component mounts, useful for search pages or modal dialogs.'
      }
    }
  }
}`,...O.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    debounceDelay: 100
  },
  parameters: {
    docs: {
      description: {
        story: 'Reduced debounce delay for more responsive search, useful for local data searching.'
      }
    }
  }
}`,...$.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    debounceDelay: 1000
  },
  parameters: {
    docs: {
      description: {
        story: 'Increased debounce delay to reduce API calls, useful for expensive search operations.'
      }
    }
  }
}`,...B.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    maxSuggestions: 12,
    suggestions: [...sampleSuggestions, ...Array.from({
      length: 8
    }, (_, i) => ({
      id: \`extra-\${i}\`,
      title: \`Property \${i + 9}\`,
      subtitle: \`Address \${i + 9}, District \${i + 1}\`,
      type: 'property' as const,
      icon: BuildingOfficeIcon
    }))]
  }
}`,...j.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({});
    const [searchHistory, setSearchHistory] = useState<SearchResult[]>([...sampleRecentSearches]);
    const handleSearch = (searchQuery: string, searchFilters: any) => {
      console.log('Search:', {
        query: searchQuery,
        filters: searchFilters
      });

      // Add to search history
      const newSearch: SearchResult = {
        query: searchQuery,
        filters: searchFilters,
        timestamp: new Date()
      };
      setSearchHistory([newSearch, ...searchHistory.slice(0, 4)]);
      alert(\`Searching for: "\${searchQuery}" with \${Object.keys(searchFilters).length} filters\`);
    };
    const handleClearHistory = () => {
      setSearchHistory([]);
      console.log('Search history cleared');
    };
    return <div className="w-full max-w-2xl">
        <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} suggestions={sampleSuggestions} recentSearches={searchHistory} filterGroups={sampleFilterGroups} filters={filters} onFilterChange={setFilters} onClearRecentSearches={handleClearHistory} placeholder="Try searching and using filters..." />

        {/* Debug Info */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
          <div><strong>Query:</strong> {query || 'None'}</div>
          <div><strong>Active Filters:</strong> {Object.keys(filters).length || 'None'}</div>
          <div><strong>Recent Searches:</strong> {searchHistory.length}</div>
          {Object.keys(filters).length > 0 && <div className="mt-2">
              <strong>Filter Details:</strong>
              <pre className="mt-1 text-xs">{JSON.stringify(filters, null, 2)}</pre>
            </div>}
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example with full state management, search history, and filter persistence. Open the console to see search events.'
      }
    }
  }
}`,...L.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: Default.args,
  parameters: {
    docs: {
      description: {
        story: \`
### Accessibility Features Demonstrated:

1. **Keyboard Navigation**:
   - Tab to focus search input
   - Arrow keys to navigate suggestions
   - Enter to select or submit
   - Escape to close dropdowns

2. **Screen Reader Support**:
   - Semantic HTML structure
   - ARIA labels for icons and buttons
   - Proper form associations

3. **Focus Management**:
   - Visible focus indicators
   - Logical tab order
   - Focus retention after interactions

4. **Visual Accessibility**:
   - High contrast colors
   - Clear visual hierarchy
   - Icon + text combinations

Try navigating this example using only the keyboard to experience the full accessibility support.
        \`
      }
    }
  }
}`,...H.parameters?.docs?.source}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  args: Default.args,
  parameters: {
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        story: 'SearchBar automatically adapts to dark mode with proper contrast and visibility.'
      }
    }
  },
  decorators: [Story => <div className="dark">
        <div className="bg-gray-900 p-6 rounded-lg">
          <Story />
        </div>
      </div>]
}`,...G.parameters?.docs?.source}}};const Je=["Default","Loading","Disabled","WithoutSuggestions","WithoutFilters","Minimal","PropertySearch","LocationSearch","TenantSearch","AutoFocus","FastDebounce","SlowDebounce","ManySuggestions","InteractiveExample","AccessibilityDemo","DarkModeExample"];export{H as AccessibilityDemo,O as AutoFocus,G as DarkModeExample,c as Default,A as Disabled,$ as FastDebounce,L as InteractiveExample,R as Loading,V as LocationSearch,j as ManySuggestions,T as Minimal,M as PropertySearch,B as SlowDebounce,I as TenantSearch,C as WithoutFilters,q as WithoutSuggestions,Je as __namedExportsOrder,Ue as default};
