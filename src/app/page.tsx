'use client';

import { useState } from 'react';

export default function Home() {
    const [forms, setForms] = useState<
        { new_id: number; title: string; values: { image: string; value: string; price: string; quantity: string }[] }[]
    >([]);

    const handleCreateForm = () => {
        setForms((prev) => [
            ...prev,
            { new_id: Date.now(), title: '', values: [{ image: '', value: '', price: '', quantity: '' }] },
        ]);
    };

    const handleChangeValueForTitle = (value: string, field: string, id: number) => {
        const newForms = forms.map((form) => {
            if (form.new_id === id) {
                return {
                    ...form,
                    [field]: value,
                };
            }

            return form;
        });

        setForms(newForms);
    };

    const handleChangeValueForValues = (value: string, field: string, id: number, id_of_value: number) => {
        const newForms = forms.map((form) => {
            if (form.new_id === id) {
                const newValues = form.values.map((value_of, index) => {
                    if (index === id_of_value) {
                        return {
                            ...value_of,
                            [field]: value,
                        };
                    }

                    return value_of;
                });

                return {
                    ...form,
                    values: newValues,
                };
            }

            return form;
        });

        setForms(newForms);
    };

    const handleConcatValues = (key: string, id: number) => {
        const newForms = forms.map((form) => {
            if (form.new_id === id) {
                const newValues = form.values.concat({ image: '', price: '', value: '', quantity: '' });

                return {
                    ...form,
                    values: newValues,
                };
            }

            return form;
        });

        switch (key) {
            case 'Enter':
                setForms(newForms);
                break;

            case ',':
                setForms(newForms);
                break;
        }
    };

    return (
        <div>
            <h1>Hello world</h1>

            <div>
                <button onClick={handleCreateForm}>Thêm tùy chọn</button>
                <form>
                    {forms &&
                        forms.map((form) => (
                            <div key={form.new_id} style={{ display: 'grid' }}>
                                <input
                                    type="text"
                                    name="title"
                                    onChange={(e) => handleChangeValueForTitle(e.target.value, 'title', form.new_id)}
                                />

                                {form.values.map((value, index) => (
                                    <div key={index}>
                                        <input
                                            type="text"
                                            name="image"
                                            placeholder="image"
                                            onChange={(e) =>
                                                handleChangeValueForValues(e.target.value, 'image', form.new_id, index)
                                            }
                                        />
                                        <input
                                            style={{ marginLeft: '6px', marginTop: '6px' }}
                                            type="text"
                                            name="value"
                                            onChange={(e) =>
                                                handleChangeValueForValues(e.target.value, 'value', form.new_id, index)
                                            }
                                            onKeyUp={(e) => handleConcatValues(e.key, form.new_id)}
                                        />
                                        <input
                                            type="text"
                                            name="price"
                                            placeholder="price"
                                            onChange={(e) =>
                                                handleChangeValueForValues(e.target.value, 'price', form.new_id, index)
                                            }
                                        />
                                        <input
                                            type="text"
                                            name="quantity"
                                            placeholder="quantity"
                                            onChange={(e) =>
                                                handleChangeValueForValues(
                                                    e.target.value,
                                                    'quantity',
                                                    form.new_id,
                                                    index,
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                </form>
            </div>
        </div>
    );
}
