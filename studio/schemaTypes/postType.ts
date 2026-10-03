import {defineArrayMember, defineField, defineType} from 'sanity'

const imageFields = [
  defineField({
    name: 'alt',
    title: 'Alternative text',
    type: 'string',
    description: 'Describe the image for readers using assistive technology.',
    validation: (rule) => rule.required(),
  }),
  defineField({name: 'caption', title: 'Caption', type: 'string'}),
]

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'publishing', title: 'Publishing'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'publishing',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => [
        rule.required(),
        rule.custom((value) =>
          !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
            ? true
            : 'Use lowercase letters, numbers, and hyphens. Keep published slugs stable.',
        ),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'A short introduction used in article cards, search previews, and RSS.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: imageFields,
    }),
    defineField({
      name: 'language',
      title: 'Article language',
      type: 'string',
      group: 'publishing',
      initialValue: 'en',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: 'Arabic', value: 'ar'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      group: 'publishing',
      initialValue: () => new Date().toISOString(),
      description:
        'Future-dated posts remain hidden until this time. Rebuild the site then to update static pages and RSS.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule
                        .required()
                        .uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({type: 'image', options: {hotspot: true}, fields: imageFields}),
        defineArrayMember({
          name: 'codeBlock',
          title: 'Code block',
          type: 'object',
          fields: [
            defineField({
              name: 'language',
              title: 'Language',
              type: 'string',
              initialValue: 'javascript',
            }),
            defineField({name: 'filename', title: 'Filename (optional)', type: 'string'}),
            defineField({
              name: 'code',
              title: 'Code',
              type: 'text',
              rows: 12,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'filename', subtitle: 'language'},
            prepare: ({title, subtitle}) => ({title: title || 'Code block', subtitle}),
          },
        }),
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Topics',
      type: 'array',
      group: 'publishing',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (rule) =>
            rule
              .max(40)
              .custom((value) =>
                !value || value === value.trim() ? true : 'Remove leading or trailing spaces.',
              ),
        }),
      ],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique().max(5),
    }),
  ],
  orderings: [
    {
      title: 'Publication date, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {select: {title: 'title', media: 'coverImage', subtitle: 'publishedAt'}},
})
