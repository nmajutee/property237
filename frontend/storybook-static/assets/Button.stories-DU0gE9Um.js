import{B as e,a as u}from"./Button-BL5Af1AR.js";import{c as p}from"./Icon-CfZfxJJJ.js";import{H as h}from"./heart-zOHFtsiJ.js";import"./iframe-CdBagT6A.js";import"./preload-helper-PPVm8Dsz.js";import"./utils-CpuazSHx.js";/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=p("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=p("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=p("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),S={title:"Primitives/Button",component:e,parameters:{layout:"centered",docs:{description:{component:"Flexible button component with multiple variants, sizes, and states. Supports icons, loading states, and full accessibility."}}},argTypes:{variant:{control:"select",options:["primary","secondary","tertiary","ghost","danger"],description:"Button visual variant"},size:{control:"select",options:["sm","md","lg"],description:"Button size"},loading:{control:"boolean",description:"Show loading spinner"},disabled:{control:"boolean",description:"Disable the button"},fullWidth:{control:"boolean",description:"Make button full width"}},tags:["autodocs"]},t={args:{variant:"primary",children:"Primary Button"}},a={args:{variant:"secondary",children:"Secondary Button"}},r={args:{variant:"tertiary",children:"Tertiary Button"}},n={args:{variant:"ghost",children:"Ghost Button"}},o={args:{variant:"danger",children:"Delete Item"}},c={render:()=>React.createElement("div",{className:"flex items-center gap-4"},React.createElement(e,{size:"sm"},"Small"),React.createElement(e,{size:"md"},"Medium"),React.createElement(e,{size:"lg"},"Large"))},i={render:()=>React.createElement("div",{className:"flex flex-col gap-4"},React.createElement("div",{className:"flex items-center gap-4"},React.createElement(e,{leftIcon:g},"Search"),React.createElement(e,{rightIcon:d,variant:"primary"},"Continue"),React.createElement(e,{leftIcon:v,variant:"ghost"},"Download")),React.createElement("div",{className:"flex items-center gap-4"},React.createElement(e,{leftIcon:h,variant:"danger"},"Remove Favorite"),React.createElement(e,{rightIcon:d,size:"lg",variant:"primary"},"Get Started")))},s={render:()=>React.createElement("div",{className:"flex flex-col gap-4"},React.createElement("div",{className:"flex items-center gap-4"},React.createElement(e,null,"Normal"),React.createElement(e,{loading:!0},"Loading"),React.createElement(e,{disabled:!0},"Disabled")),React.createElement("div",{className:"flex items-center gap-4"},React.createElement(e,{variant:"primary"},"Normal"),React.createElement(e,{variant:"primary",loading:!0},"Loading"),React.createElement(e,{variant:"primary",disabled:!0},"Disabled")))},l={render:()=>React.createElement("div",{className:"w-80"},React.createElement(e,{fullWidth:!0,variant:"primary",rightIcon:d},"Full Width Button"))},m={render:()=>React.createElement("div",{className:"flex flex-col gap-6"},React.createElement("div",null,React.createElement("h4",{className:"text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300"},"Horizontal Group"),React.createElement(u,null,React.createElement(e,null,"Cancel"),React.createElement(e,{variant:"primary"},"Save"))),React.createElement("div",null,React.createElement("h4",{className:"text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300"},"Action Group"),React.createElement(u,{spacing:"md"},React.createElement(e,{leftIcon:g,variant:"ghost"},"Search"),React.createElement(e,{leftIcon:v,variant:"secondary"},"Export"),React.createElement(e,{rightIcon:d,variant:"primary"},"Continue"))),React.createElement("div",null,React.createElement("h4",{className:"text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300"},"Vertical Group"),React.createElement(u,{orientation:"vertical",spacing:"sm"},React.createElement(e,{variant:"tertiary"},"Edit Property"),React.createElement(e,{variant:"tertiary"},"View Details"),React.createElement(e,{variant:"danger"},"Delete Property"))))};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    children: 'Secondary Button'
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'tertiary',
    children: 'Tertiary Button'
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    children: 'Ghost Button'
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    children: 'Delete Item'
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button leftIcon={Search}>Search</Button>
        <Button rightIcon={ArrowRight} variant="primary">Continue</Button>
        <Button leftIcon={Download} variant="ghost">Download</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button leftIcon={Heart} variant="danger">Remove Favorite</Button>
        <Button rightIcon={ArrowRight} size="lg" variant="primary">Get Started</Button>
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button>Normal</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="primary">Normal</Button>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    </div>
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80">
      <Button fullWidth variant="primary" rightIcon={ArrowRight}>
        Full Width Button
      </Button>
    </div>
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <div>
        <h4 className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">Horizontal Group</h4>
        <ButtonGroup>
          <Button>Cancel</Button>
          <Button variant="primary">Save</Button>
        </ButtonGroup>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">Action Group</h4>
        <ButtonGroup spacing="md">
          <Button leftIcon={Search} variant="ghost">Search</Button>
          <Button leftIcon={Download} variant="secondary">Export</Button>
          <Button rightIcon={ArrowRight} variant="primary">Continue</Button>
        </ButtonGroup>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3 text-neutral-700 dark:text-neutral-300">Vertical Group</h4>
        <ButtonGroup orientation="vertical" spacing="sm">
          <Button variant="tertiary">Edit Property</Button>
          <Button variant="tertiary">View Details</Button>
          <Button variant="danger">Delete Property</Button>
        </ButtonGroup>
      </div>
    </div>
}`,...m.parameters?.docs?.source}}};const N=["Primary","Secondary","Tertiary","Ghost","Danger","Sizes","WithIcons","States","FullWidth","ButtonGroups"];export{m as ButtonGroups,o as Danger,l as FullWidth,n as Ghost,t as Primary,a as Secondary,c as Sizes,s as States,r as Tertiary,i as WithIcons,N as __namedExportsOrder,S as default};
