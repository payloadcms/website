'use client'

import type React from 'react'
// import { ContentGrid, ContentGridProps } from '@blocks/ContentGrid/index'

// import { StyleguidePageContent } from '../../PageContent/index'

// const data: ContentGridProps = {
//   blockType: 'contentGrid',
//   contentGridFields: {
//     content: [
//       {
//         children: [
//           {
//             text: '01',
//           },
//         ],
//         type: 'label',
//       },
//       {
//         children: [
//           {
//             text: '',
//           },
//           {
//             type: 'link',
//             linkType: 'internal',
//             url: '',
//             doc: {
//               value: {
//                 id: '6362c3ee5b4dcb5b5c7f3a81',
//                 updatedAt: '2022-11-02T19:25:14.726Z',
//                 createdAt: '2022-11-01T15:42:11.111Z',
//                 title: 'Hullbot',
//                 introContent: [
//                   {
//                     children: [
//                       {
//                         text: 'A Hullbot website with every feature in the book.',
//                       },
//                     ],
//                     type: 'h2',
//                   },
//                 ],
//                 featuredImage: {
//                   id: '63613e44ac92f4d422f93b0a',
//                   alt: 'Screenshot of the hopenetwork.org homepage',
//                   filename: 'hope-network-homepage.jpg',
//                   mimeType: 'image/jpeg',
//                   filesize: 1177885,
//                   width: 1762,
//                   height: 997,
//                   createdAt: '2022-11-01T15:41:56.904Z',
//                   updatedAt: '2022-11-01T15:41:56.904Z',
//                   url: '/media/hope-network-homepage.jpg',
//                 },
//                 layout: [
//                   {
//                     contentFields: {
//                       layout: 'oneColumn',
//                       columnOne: [
//                         {
//                           children: [
//                             {
//                               text: 'Payload has delivered Hope Network with a truly enterprise-tier website CMS.',
//                             },
//                           ],
//                           type: 'h4',
//                         },
//                       ],
//                     },
//                     id: '63618ad31011a841528d5421',
//                     blockType: 'content',
//                   },
//                   {
//                     contentFields: {
//                       layout: 'twoColumns',
//                       columnOne: [
//                         {
//                           children: [
//                             {
//                               text: 'And thanks to Payload’s code-based nature, this is only the beginning. Over time, Hope will add more and more functionality to its site, which will allow it to continue to provide ROI to the organization for years to come.',
//                             },
//                           ],
//                         },
//                       ],
//                       columnTwo: [
//                         {
//                           children: [
//                             {
//                               text: 'The organization consists of 8 “service lines” and hundreds of pages of content. Among the content models are Subsites, Forms, Housing, Locations, People, Redirects, and much more.',
//                             },
//                           ],
//                         },
//                       ],
//                     },
//                     id: '63618d251011a841528d5422',
//                     blockType: 'content',
//                   },
//                   {
//                     contentFields: {
//                       layout: 'oneColumn',
//                       columnOne: [
//                         {
//                           children: [
//                             {
//                               text: 'Multi-tenant, “subsite”-based access control',
//                             },
//                           ],
//                           type: 'h2',
//                         },
//                       ],
//                     },
//                     id: '636193221011a841528d5423',
//                     blockType: 'content',
//                   },
//                   {
//                     sliderFields: {
//                       sliderType: 'imageSlider',
//                       imageSlides: [
//                         {
//                           image: {
//                             id: '635a86bd45c951f3f9132c03',
//                             alt: 'Dark textured card that reads: Launch week (and building our site in public)',
//                             filename: 'launch-week.webp',
//                             mimeType: 'image/webp',
//                             filesize: 31768,
//                             width: 1920,
//                             height: 1079,
//                             createdAt: '2022-10-27T13:25:17.760Z',
//                             updatedAt: '2022-10-27T13:25:17.760Z',
//                             url: '/media/launch-week.webp',
//                           },
//                           id: '63613dda246cb1b8ea11ba1c',
//                         },
//                         {
//                           image: {
//                             id: '635a86bd45c951f3f9132c03',
//                             alt: 'Dark textured card that reads: Launch week (and building our site in public)',
//                             filename: 'launch-week.webp',
//                             mimeType: 'image/webp',
//                             filesize: 31768,
//                             width: 1920,
//                             height: 1079,
//                             createdAt: '2022-10-27T13:25:17.760Z',
//                             updatedAt: '2022-10-27T13:25:17.760Z',
//                             url: '/media/launch-week.webp',
//                           },
//                           id: '63613ddd246cb1b8ea11ba1d',
//                         },
//                         {
//                           image: {
//                             id: '635a86bd45c951f3f9132c03',
//                             alt: 'Dark textured card that reads: Launch week (and building our site in public)',
//                             filename: 'launch-week.webp',
//                             mimeType: 'image/webp',
//                             filesize: 31768,
//                             width: 1920,
//                             height: 1079,
//                             createdAt: '2022-10-27T13:25:17.760Z',
//                             updatedAt: '2022-10-27T13:25:17.760Z',
//                             url: '/media/launch-week.webp',
//                           },
//                           id: '63613ddf246cb1b8ea11ba1e',
//                         },
//                       ],
//                       quoteSlides: [],
//                     },
//                     id: '63613dd5246cb1b8ea11ba1b',
//                     blockName: 'Image Slider',
//                     blockType: 'slider',
//                   },
//                 ],
//                 slug: 'hullbot',
//                 link: {
//                   type: 'custom',
//                   url: 'https://hopenetwork.org/',
//                 },
//                 _status: 'published',
//                 meta: {},
//               },
//               relationTo: 'case-studies',
//             },
//             children: [
//               {
//                 text: 'Website',
//               },
//             ],
//           },
//           {
//             text: '',
//           },
//         ],
//         type: 'h4',
//       },
//       {
//         children: [
//           {
//             text: 'Payload powers content for websites both large and small in an extremely fast, manageable and scalable manner.',
//           },
//         ],
//       },
//     ],
//     cells: [
//       {
//         content: [
//           {
//             children: [
//               {
//                 text: '01',
//               },
//             ],
//             type: 'label',
//           },
//           {
//             children: [
//               {
//                 text: '',
//               },
//               {
//                 type: 'link',
//                 linkType: 'internal',
//                 url: '',
//                 doc: {
//                   value: {
//                     id: '6362c3ee5b4dcb5b5c7f3a81',
//                     updatedAt: '2022-11-02T19:25:14.726Z',
//                     createdAt: '2022-11-01T15:42:11.111Z',
//                     title: 'Hullbot',
//                     introContent: [
//                       {
//                         children: [
//                           {
//                             text: 'A Hullbot website with every feature in the book.',
//                           },
//                         ],
//                         type: 'h2',
//                       },
//                     ],
//                     featuredImage: {
//                       id: '63613e44ac92f4d422f93b0a',
//                       alt: 'Screenshot of the hopenetwork.org homepage',
//                       filename: 'hope-network-homepage.jpg',
//                       mimeType: 'image/jpeg',
//                       filesize: 1177885,
//                       width: 1762,
//                       height: 997,
//                       createdAt: '2022-11-01T15:41:56.904Z',
//                       updatedAt: '2022-11-01T15:41:56.904Z',
//                       url: '/media/hope-network-homepage.jpg',
//                     },
//                     layout: [
//                       {
//                         contentFields: {
//                           layout: 'oneColumn',
//                           columnOne: [
//                             {
//                               children: [
//                                 {
//                                   text: 'Payload has delivered Hope Network with a truly enterprise-tier website CMS.',
//                                 },
//                               ],
//                               type: 'h4',
//                             },
//                           ],
//                         },
//                         id: '63618ad31011a841528d5421',
//                         blockType: 'content',
//                       },
//                       {
//                         contentFields: {
//                           layout: 'twoColumns',
//                           columnOne: [
//                             {
//                               children: [
//                                 {
//                                   text: 'And thanks to Payload’s code-based nature, this is only the beginning. Over time, Hope will add more and more functionality to its site, which will allow it to continue to provide ROI to the organization for years to come.',
//                                 },
//                               ],
//                             },
//                           ],
//                           columnTwo: [
//                             {
//                               children: [
//                                 {
//                                   text: 'The organization consists of 8 “service lines” and hundreds of pages of content. Among the content models are Subsites, Forms, Housing, Locations, People, Redirects, and much more.',
//                                 },
//                               ],
//                             },
//                           ],
//                         },
//                         id: '63618d251011a841528d5422',
//                         blockType: 'content',
//                       },
//                       {
//                         contentFields: {
//                           layout: 'oneColumn',
//                           columnOne: [
//                             {
//                               children: [
//                                 {
//                                   text: 'Multi-tenant, “subsite”-based access control',
//                                 },
//                               ],
//                               type: 'h2',
//                             },
//                           ],
//                         },
//                         id: '636193221011a841528d5423',
//                         blockType: 'content',
//                       },
//                       {
//                         sliderFields: {
//                           sliderType: 'imageSlider',
//                           imageSlides: [
//                             {
//                               image: {
//                                 id: '635a86bd45c951f3f9132c03',
//                                 alt: 'Dark textured card that reads: Launch week (and building our site in public)',
//                                 filename: 'launch-week.webp',
//                                 mimeType: 'image/webp',
//                                 filesize: 31768,
//                                 width: 1920,
//                                 height: 1079,
//                                 createdAt: '2022-10-27T13:25:17.760Z',
//                                 updatedAt: '2022-10-27T13:25:17.760Z',
//                                 url: '/media/launch-week.webp',
//                               },
//                               id: '63613dda246cb1b8ea11ba1c',
//                             },
//                             {
//                               image: {
//                                 id: '635a86bd45c951f3f9132c03',
//                                 alt: 'Dark textured card that reads: Launch week (and building our site in public)',
//                                 filename: 'launch-week.webp',
//                                 mimeType: 'image/webp',
//                                 filesize: 31768,
//                                 width: 1920,
//                                 height: 1079,
//                                 createdAt: '2022-10-27T13:25:17.760Z',
//                                 updatedAt: '2022-10-27T13:25:17.760Z',
//                                 url: '/media/launch-week.webp',
//                               },
//                               id: '63613ddd246cb1b8ea11ba1d',
//                             },
//                             {
//                               image: {
//                                 id: '635a86bd45c951f3f9132c03',
//                                 alt: 'Dark textured card that reads: Launch week (and building our site in public)',
//                                 filename: 'launch-week.webp',
//                                 mimeType: 'image/webp',
//                                 filesize: 31768,
//                                 width: 1920,
//                                 height: 1079,
//                                 createdAt: '2022-10-27T13:25:17.760Z',
//                                 updatedAt: '2022-10-27T13:25:17.760Z',
//                                 url: '/media/launch-week.webp',
//                               },
//                               id: '63613ddf246cb1b8ea11ba1e',
//                             },
//                           ],
//                           quoteSlides: [],
//                         },
//                         id: '63613dd5246cb1b8ea11ba1b',
//                         blockName: 'Image Slider',
//                         blockType: 'slider',
//                       },
//                     ],
//                     slug: 'hullbot',
//                     link: {
//                       type: 'custom',
//                       url: 'https://hopenetwork.org/',
//                     },
//                     _status: 'published',
//                     meta: {},
//                   },
//                   relationTo: 'case-studies',
//                 },
//                 children: [
//                   {
//                     text: 'Website',
//                   },
//                 ],
//               },
//               {
//                 text: '',
//               },
//             ],
//             type: 'h4',
//           },
//           {
//             children: [
//               {
//                 text: 'Payload powers content for websites both large and small in an extremely fast, manageable and scalable manner.',
//               },
//             ],
//           },
//         ],
//         id: '6363e3c1f04070411015b35b',
//       },
//       {
//         content: [
//           {
//             children: [
//               {
//                 text: '02',
//               },
//             ],
//             type: 'label',
//           },
//           {
//             children: [
//               {
//                 text: '',
//               },
//               {
//                 type: 'link',
//                 linkType: 'internal',
//                 url: '',
//                 doc: {
//                   value: '6362c3ee5b4dcb5b5c7f3a81',
//                   relationTo: 'case-studies',
//                 },
//                 children: [
//                   {
//                     text: 'Web Apps',
//                   },
//                 ],
//               },
//               {
//                 text: '',
//               },
//             ],
//             type: 'h4',
//           },
//           {
//             children: [
//               {
//                 text: 'Build complex web apps using Payload as your backend. Implement any type of business logic you need with Hooks.',
//               },
//             ],
//           },
//         ],
//         id: '636889e3795126c43286acab',
//       },
//       {
//         content: [
//           {
//             children: [
//               {
//                 text: '03',
//               },
//             ],
//             type: 'label',
//           },
//           {
//             children: [
//               {
//                 text: '',
//               },
//               {
//                 type: 'link',
//                 linkType: 'internal',
//                 doc: {
//                   value: '6362c4025b4dcb5b5c7f3aeb',
//                   relationTo: 'case-studies',
//                 },
//                 children: [
//                   {
//                     text: 'Native apps',
//                   },
//                 ],
//               },
//               {
//                 text: '',
//               },
//             ],
//             type: 'h4',
//           },
//           {
//             children: [
//               {
//                 text: 'Build complex web apps using Payload as your backend. Implement any type of business logic you need with Hooks.',
//               },
//             ],
//           },
//         ],
//         id: '63689618795126c43286acac',
//       },
//       {
//         content: [
//           {
//             children: [
//               {
//                 text: '04',
//               },
//             ],
//             type: 'label',
//           },
//           {
//             children: [
//               {
//                 text: 'Ecommerce',
//               },
//             ],
//             type: 'h4',
//           },
//           {
//             children: [
//               {
//                 text: 'If you need more customization than off-the-shelf ecommerce platforms can provide, Payload is for you.',
//               },
//             ],
//           },
//         ],
//         id: '6368964e795126c43286acad',
//       },
//       {
//         content: [
//           {
//             children: [
//               {
//                 text: '05',
//               },
//             ],
//             type: 'label',
//           },
//           {
//             children: [
//               {
//                 text: 'Subscription',
//               },
//             ],
//             type: 'h4',
//           },
//           {
//             children: [
//               {
//                 text: 'Pair Payload with Stripe or a similar payments engine to create your own full subscriptions app.',
//               },
//             ],
//           },
//         ],
//         id: '6368965f795126c43286acae',
//       },
//       {
//         content: [
//           {
//             children: [
//               {
//                 text: '06',
//               },
//             ],
//             type: 'label',
//           },
//           {
//             children: [
//               {
//                 text: 'Omnichannel',
//               },
//             ],
//             type: 'h4',
//           },
//           {
//             children: [
//               {
//                 text: 'Author content in one place, but use it anywhere. Truly decouple your content from your presentation.',
//               },
//             ],
//           },
//         ],
//         id: '63689673795126c43286acaf',
//       },
//     ],
//   },
// }

// const dataWithContainer: ContentGridProps = {
//   ...data,
//   contentGridFields: {
//     ...data.contentGridFields,
//   },
// }

export const ContentGridPage: React.FC = () => {
  // Disabled until frontend work is done
  return null
  // return (
  //   <StyleguidePageContent title="Media Content" darkModePadding darkModeMargins>
  //     <ContentGrid {...data} />
  //     <ContentGrid {...dataWithContainer} />
  //   </StyleguidePageContent>
  // )
}
