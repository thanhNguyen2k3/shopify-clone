'use client';

import Image from 'next/image';
import { LiaAngleLeftSolid, LiaAngleRightSolid } from 'react-icons/lia';
import { useState, useCallback, Fragment } from 'react';
import { RiSubtractLine, RiAddLargeLine } from 'react-icons/ri';
import { MdOutlineZoomOutMap } from 'react-icons/md';
import { BsCart2 } from 'react-icons/bs';
import Slider from 'react-slick';
import { toast } from 'react-toastify';

import styles from './detail.module.scss';
import { useResponsive } from '@/hooks/useResponsive';
import Button from '@/components/button/button';
import { ExtandDataProps, ExtandVariant } from '@/types';
import ExtandMethod from '@/components/extand-method/extand-method';
import TranportForm from '@/components/tranport-form/tranport-form';
import styled from 'styled-components';
import { useBearStore } from '@/zustan/config';

type Props = { data: ExtandDataProps };

const StyleSlider = styled(Slider)`
    .slick-slide {
        div {
            height: 80px;
        }
    }
`;

const Detail = ({ data }: Props) => {
    // Filter Data
    // filter data
    const product = data;
    const sale =
        product?.price &&
        product.core &&
        (
            ((Number(product?.core?.split(' ')[0]) - Number(product?.price?.split(' ')[0])) /
                Number(product?.core?.split(' ')[0])) *
            100
        ).toFixed(0);

    const priceOnVariants = product?.variants?.map((variant) => variant.price);

    let maxNumber = priceOnVariants![0];
    let minNumber = priceOnVariants![0];

    for (let i = 1; i < priceOnVariants?.length!; i++) {
        if (priceOnVariants![i]! > maxNumber!) {
            maxNumber = priceOnVariants![i]!;
        }
        if (priceOnVariants![i]! < minNumber!) {
            minNumber = priceOnVariants![i];
        }
    }

    // State

    const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({});
    const [selectedVariant, setSelectedVariant] = useState<ExtandVariant | null>(null);

    const handleChangeValueWithInput = (value: string, title: string) => {
        setSelectedValues((prev) => ({
            ...prev,
            [title]: value, // Chỉ chọn một giá trị duy nhất cho mỗi title
        }));

        // Tìm chỉ số của ảnh tương ứng và cập nhật sliderIndex
        const selectedArray = Object.values({ ...selectedValues, [title]: value }); // Cập nhật array với giá trị mới
        const matchingItem = product?.variants?.findIndex((item) =>
            item.combinations.every((val) => selectedArray.includes(val)),
        );

        // (product?.variants?.[matchingItem!]); // Lấy giữ liệu được lựa chọn
        if (product?.variants?.[matchingItem!]!) setSelectedVariant(product?.variants?.[matchingItem!]!);

        if (matchingItem !== -1) {
            setSliderIndex(matchingItem!); // Cập nhật chỉ số của slider
            nav1?.slickGoTo(matchingItem); // Chuyển đến ảnh trùng khớp
        }
    };

    // Hàm để lấy các ảnh trùng khớp với dữ liệu đã chọn

    // Responsive
    const breakpoints = useResponsive([430, 768]);

    const [images, _setImages] = useState<any[] | null>(product?.images!);

    const [currentIndexInModal, setCurrentIndexInModal] = useState(0);
    const [sliderIndex, setSliderIndex] = useState<number>(0);
    const [imagesInModal, _setImagesInModal] = useState(product?.images!);

    const [modal, setModal] = useState<boolean>(false);

    // zoom in modal
    const [isZoomed, setIsZoomed] = useState(false);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });

    // Detail state
    const [quantity, setQuantity] = useState<number>(1);

    // Handle detail state

    const handleCallBackQuantity = useCallback(
        (type: 'sub' | 'add') => {
            if (type === 'add') {
                setQuantity(quantity + 1);
            }

            if (type === 'sub') {
                if (quantity <= 1) {
                    return toast(`Tối thiểu 1 trên mỗi đơn hàng`, {
                        position: 'top-right',
                    });
                }

                setQuantity(quantity - 1);
            }
        },
        [quantity],
    );

    // Handle

    const handleImageClick = (e: any) => {
        e.stopPropagation();
        // Tính toán vị trí click so với kích thước hình ảnh
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Đặt vị trí transform-origin tại nơi click
        setOrigin({ x, y });
        setIsZoomed(!isZoomed);
    };
    //

    const imagesToShow = 5; // Số lượng ảnh hiển thị cùng lúc

    // On modal

    const handlePreviousInModal = (e: any) => {
        e.stopPropagation();
        setCurrentIndexInModal((prevIndex) => {
            const newIndex = prevIndex === 0 ? images?.length! - (imagesToShow - 4) : prevIndex - 1;
            return newIndex;
        });
    };

    const handleNextInModal = (e: any) => {
        e.stopPropagation();
        setCurrentIndexInModal((prevIndex) => {
            const newIndex = prevIndex >= images?.length! - (imagesToShow - 4) ? 0 : prevIndex + 1;
            return newIndex;
        });
    };

    // Slider

    const [nav1, setNav1] = useState<any>(null);
    const [nav2, setNav2] = useState<any>(null);

    // Use Query

    // Zustand bear build cart

    const { addToCart, items, clearCart } = useBearStore((state) => state);

    const addToCartForZustand = useCallback(() => {
        if (product.variants?.length! > 0) {
            if (!selectedVariant) {
                return toast(`Vui lòng hoàn tất lựa chọn của bạn`, {
                    position: 'top-center',
                });
            } else {
                toast(`Đã thêm vào giỏ hàng`, {
                    position: 'top-center',
                });
                return addToCart(
                    { ...selectedVariant, variant_id: selectedVariant.id, product_id: selectedVariant.product_id },
                    quantity,
                );
            }
        } else {
            toast(`Đã thêm vào giỏ hàng`, {
                position: 'top-center',
            });
            return addToCart({ ...product, product_id: product.id }, quantity);
        }
    }, [addToCart, quantity, selectedVariant, product]);

    console.log(items);

    return (
        <div>
            <div
                style={{
                    position: 'fixed',
                    right: 10,
                    bottom: 10,
                    width: 60,
                    height: 60,
                    borderRadius: '999px',
                    backgroundColor: 'ThreeDShadow',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Button onClick={clearCart} activeType="button" variant="remove" sx={{ color: '#fff' }}>
                    <BsCart2 />
                </Button>
            </div>

            <div
                className={styles.wrapper}
                style={
                    breakpoints <= 1
                        ? { display: 'block' }
                        : {
                              display: 'flex',
                              flexWrap: 'wrap',
                              alignItems: 'flex-start',
                              borderBottom: '10px solid #f1f1f1',
                          }
                }
            >
                <div className={styles.wrapper_images}>
                    <div className={styles.box_images}>
                        {/* Responsive */}

                        <Fragment>
                            <div style={{ position: 'relative' }}>
                                <Slider
                                    initialSlide={sliderIndex}
                                    dots={false}
                                    arrows={false}
                                    asNavFor={nav2}
                                    ref={(slider) => setNav1(slider)}
                                    afterChange={(current: number) => setSliderIndex(current)}
                                >
                                    {images?.map((item, index) => (
                                        <div style={{ minWidth: '100%' }} key={index}>
                                            <Image
                                                style={{ objectFit: 'cover', maxWidth: '450px', width: '100%' }}
                                                src={item?.image?.url!}
                                                width={450}
                                                height={450}
                                                alt="img"
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </Slider>
                                <div className={styles.show_modal_button} onClick={() => setModal(true)}>
                                    <div className={styles.button}>
                                        <MdOutlineZoomOutMap fontSize={20} />
                                    </div>
                                    <span>Nhấp để phóng to</span>
                                </div>
                            </div>

                            <StyleSlider
                                asNavFor={nav1}
                                arrows={false}
                                ref={(slider) => setNav2(slider)}
                                slidesToShow={breakpoints === 0 ? 3 : product.images?.length! <= 3 ? 3 : 5}
                                swipeToSlide={true}
                                focusOnSelect={true}
                                dots={false}
                            >
                                {images?.map((item, index) => (
                                    <div key={index}>
                                        <Image
                                            style={{
                                                objectFit: 'cover',
                                                width: '100%',
                                                height: '100%',
                                                maxHeight: '80px',
                                                minHeight: '80px',
                                            }}
                                            src={item.image.url}
                                            width={90}
                                            height={90}
                                            alt="img"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </StyleSlider>
                        </Fragment>
                    </div>
                </div>

                {/* Content */}
                <div
                    className={styles.content}
                    style={{ borderLeft: '10px solid #f1f1f1', borderRight: '10px solid #f1f1f1' }}
                >
                    <div className={styles.wrapper_block}>
                        <h1 style={breakpoints < 1 ? { fontSize: '24px' } : {}}>{product?.title}</h1>

                        <>
                            {selectedVariant ? (
                                <div className={styles.price}>
                                    <span className={styles.cost}>{selectedVariant.price}</span>
                                </div>
                            ) : (
                                <div className={styles.price}>
                                    {product?.price && product?.core ? (
                                        <>
                                            <span className={styles.sale}>{product.core}</span>
                                            <span className={styles.cost}>{product.price}</span>
                                            <span className={styles.percent}>Giảm {sale}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.cost}>{product?.core}</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    </div>

                    <div className={styles.wrapper_block}>
                        <ExtandMethod
                            title="Vận chuyển"
                            heading="Lựa chọn địa chỉ vận chuyển"
                            style={{ fontSize: 14, fontWeight: 600, color: '#000' }}
                            extand
                            body={<TranportForm />}
                        />

                        <div
                            className={styles.inform_detail}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}
                        >
                            <Image unoptimized src={'/free-ship.png'} alt="free-ship" width={24} height={24} />
                            <span>Miễn phí vận chuyển</span>
                        </div>
                    </div>

                    <div className={styles.wrapper_block}>
                        {product?.form_combines &&
                            product.form_combines.map((combine) => (
                                <div key={combine.id} className={` ${styles.inform}`}>
                                    <h4>{combine.title}</h4>
                                    <div className={styles.radio_inputs}>
                                        {combine.values.map((value) => (
                                            <label key={value}>
                                                <input
                                                    className={styles.radio_input}
                                                    type="radio"
                                                    name={combine.title!}
                                                    id={combine.title!}
                                                    value={value}
                                                    checked={selectedValues[combine.title!] === value}
                                                    onChange={(e) =>
                                                        handleChangeValueWithInput(e.target.value, e.target.name)
                                                    }
                                                />
                                                <div className={styles.radio_title}>
                                                    <span className={styles.radio_label}>{value}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}

                        <div className={` ${styles.inform}`}>
                            <h4>Số lượng</h4>
                            <div>
                                <div className={styles.quantity}>
                                    <button onClick={() => handleCallBackQuantity('sub')}>
                                        <RiSubtractLine />
                                    </button>
                                    <input
                                        value={quantity}
                                        onChange={(e) => {
                                            Number(e.target.value) <= 1
                                                ? setQuantity(1)
                                                : setQuantity(Number(e.target.value));
                                        }}
                                        type="number"
                                        min={1}
                                    />
                                    <button onClick={() => handleCallBackQuantity('add')}>
                                        <RiAddLargeLine />
                                    </button>
                                </div>

                                {selectedVariant && (
                                    <span style={{ marginTop: '6px', display: 'block' }}>
                                        {Number(selectedVariant.available?.split(' ')[0])} có sẵn
                                    </span>
                                )}
                            </div>
                        </div>

                        <div
                            className={styles.inform}
                            style={
                                breakpoints === 0
                                    ? { position: 'fixed', bottom: 0, left: 0, right: 0, gap: 0, zIndex: 480 }
                                    : { marginTop: '18px' }
                            }
                        >
                            {breakpoints !== 0 && <h4></h4>}
                            <Button
                                sx={breakpoints === 0 ? { width: '50%', height: 60, borderRadius: 0 } : { height: 40 }}
                                activeType="button"
                                variant="secondary"
                                icon={BsCart2}
                                placement="left"
                                onClick={addToCartForZustand}
                            >
                                Thêm vào giỏ hàng
                            </Button>

                            <Button
                                sx={
                                    breakpoints === 0
                                        ? {
                                              width: '50%',
                                              height: 60,
                                              borderRadius: 0,
                                              backgroundColor: '#e22c38',
                                              boxShadow: 'none',
                                          }
                                        : { height: 40, backgroundColor: '#e22c38', boxShadow: 'none' }
                                }
                                activeType="button"
                                variant="primary"
                            >
                                Mua ngay
                            </Button>
                        </div>
                    </div>

                    <div className={styles.wrapper_block}>
                        <div className={` ${styles.inform}`}>
                            <ExtandMethod
                                title="Hình thức thanh toán"
                                style={{ fontSize: 14, fontWeight: 600, color: '#000' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                                    <Image src={'/cod.png'} alt="cod" width={24} height={24} />
                                    <h4 style={{ maxWidth: '100%' }}>Thanh toán khi nhận hàng (COD)</h4>
                                </div>
                            </ExtandMethod>
                        </div>
                    </div>
                </div>

                {/* Modal content */}

                {/* Modal show image */}

                <div
                    style={modal ? { transform: 'translateY(0%)' } : { transform: 'translateY(100%)' }}
                    className={styles.modal_wrapper}
                >
                    <div
                        className={styles.modal}
                        style={modal ? { transform: 'translateY(0)' } : { transform: 'translateY(100%)' }}
                        onClick={() => setModal(false)}
                    >
                        <button onClick={handlePreviousInModal}>
                            <LiaAngleLeftSolid fontSize={16} />
                        </button>
                        <button onClick={handleNextInModal}>
                            <LiaAngleRightSolid fontSize={16} />
                        </button>

                        <div className={styles.modal_item}>
                            <Image
                                unoptimized
                                style={{ transformOrigin: `${origin.x}% ${origin.y}%` }}
                                onClick={handleImageClick}
                                src={imagesInModal?.[currentIndexInModal!]?.image?.url!}
                                className={isZoomed ? styles.zoomed : ''}
                                width={600}
                                height={600}
                                alt="image in modal"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.wrapper_block} style={breakpoints < 1 ? { marginBottom: 60 } : {}}>
                <h3>Giới thiệu về sản phẩm này</h3>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div
                        className={styles.description}
                        dangerouslySetInnerHTML={{
                            __html: product?.description!,
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
