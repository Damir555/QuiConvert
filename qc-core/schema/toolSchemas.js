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
    }
};