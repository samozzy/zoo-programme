import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.CLIENT_ID,
  token: process.env.READ_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "./",
  },
  media: {
    tina: {
      mediaRoot: "static",
      publicFolder: "./",
    },
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "_content",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "copy_short",
            label: "Short copy (for page previews)",
            required: false,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          filename: {
            readonly: true,
            slugify: values => {        
              return `${values?.title?.toLowerCase().replace(/ /g, '-')}`
            }
          }
        },
      },
      {
        name: "venues"
        label: "venues"
        path: "_data/venues.yml",
        format: "yml"
      }
      {
        name: "shows",
        label: "Shows",
        path: "_data/shows.yml",
        format: "yml",
        fields: [
          { 
            type: "string",
            name: "title",
            required: true,
            isTitle: true,
          },
          {
            type: "boolean",
            name: "is_draft",
            required: false,
          },
          { 
            type: "string",
            name: "company",
            required: true,
          },
          { 
            type: "reference",
            name: "venue",
            collections: ['venues'],
            required: true,
          },
          {
            type: "string",
            name: "start_time",
            required: true,
          },
          { 
            type: "string",
            name: "duration",
            required: true,
          },
          {
            type: "string",
            name: "performances",
            required: true,
            ui {
              list: true,
              min: 1,
            },
          },
          // Add pricing
          {
            type: "string"
            name: "ticket_url",
            required: false,
          },
          {
            type: "boolean",
            name: "booking_unavailable",
          },
          {
            type: "string",
            name: "genre",
            required: false,
            ui {
              list: true,
              min: 0
            },
          },
          { 
            type: "string",
            name: "age_guidance",
            required: false,
            // Add list
          },
          {
            type: "boolean",
            name: "age_restricted",
            required: false,
          },
          // Add access details as list 
          {
            type: "string",
            name: "content_warnings",
            ui {
              list: true,
              min: 0,
            },
          },
          {
            type: "string",
            name: "content_warning_detail",
            required: false,
          },
          // Add image & image alt text
          // Add video embeds, links, reviews
          {
            type: "rich-text",
            name: "copy_short",
            required: false,
          },
          {
            type: "rich-text",
            name: "copy_long",
            required: false,
          },
        ]
      }
    ],
  },
});
