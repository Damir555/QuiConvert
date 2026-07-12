export const TOOL_SCHEMAS = {
    merge: {
        title: 'Merge PDF',
        fields: []
    },

    split: {
        title: 'Split PDF',

        fields: [
            {
                id: 'mode',
                type: 'radio',

                options: [
                    {
                        value: 'every-page',
                        label: 'Split every page',
                        checked: true
                    },
                    {
                        value: 'extract',
                        label: 'Extract selected pages'
                    }
                ]
            },

            {
                id: 'splitPages',
                type: 'text',
                label: 'Page range',
                placeholder: 'Example: 1-3,5,8-10',

                enabledWhen: {
                    field: 'mode',
                    equals: 'extract'
                }
            }
        ]
    },

    rotate: {
        title: 'Rotate PDF',

        fields: [
            {
                id: 'rotation',
                type: 'radio',
                label: 'Rotation angle',

                options: [
                    {
                        value: '90',
                        label: '90° clockwise',
                        checked: true
                    },
                    {
                        value: '180',
                        label: '180°'
                    },
                    {
                        value: '270',
                        label: '270° clockwise'
                    }
                ]
            }
        ]
    },

    compress: {
        title: 'Compress PDF',

        fields: []
},

    protect: {
    title: 'Protect PDF',

    fields: [
        {
            id: 'password',
            type: 'text',
            inputType: 'password',
            label: 'Password',
            placeholder: 'Enter a password',
            required: true,
            minLength: 4,
            messages: {
                required: 'Please enter a password.',
                minLength: 'Password must contain at least 4 characters.'
            }
        }
    ]
},

    unlock: {
    title: 'Unlock PDF',

    fields: [
        {
            id: 'password',
            type: 'text',
            inputType: 'password',
            label: 'Password',
            placeholder: 'Enter PDF password',
            required: true,
            minLength: 1,
            messages: {
                required: 'Please enter the PDF password.'
            }
        }
    ]
}
};