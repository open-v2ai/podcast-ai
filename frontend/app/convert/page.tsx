'use client';

import React, {useEffect, useState} from 'react';
import {Col, Row, Input, Button, Space, ConfigProvider, message} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import MyButton from '../../components/MyButton';

const {TextArea} = Input;

const ConvertPage: React.FC = () => {
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inputType, setInputType] = useState('text');
    const [userId, setUserId] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();
    const [windowHeight, setWindowHeight] = useState(0);

    const router = useRouter();

    useEffect(() => {
        setWindowHeight(window.innerHeight);
    }, []);

    useEffect(() => {
        const localUserId = parseInt(localStorage.getItem('podcast-ai-user-id') ?? '0')
        setUserId(localUserId)
        if (localUserId === 0) {
            router.push('/')
        }
    }, [router, userId])

    const onConvert = async () => {
        setIsLoading(true);

        const inputData = {
            'user_id': userId,
            'content': userInput,
            'content_type': inputType,
            'origin_content': ''
        }
        const res = await fetch(process.env.apiUrl + '/podcast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputData)
        });
        if (!res.ok) {
            messageApi.error('failed to fetch data!');
        }
        const resData = await res.json()
        if (resData['success']) {
            const audioUrl = resData['podcast']['summary_audio_file_url'];
            const title = resData['podcast']['title'];
            router.push('/play?audioUrl=' + audioUrl + '&title=' + title);
        } else {
            messageApi.error(resData['message']);
        }
        setIsLoading(false);
    };

    const onClickButton = (value: string) => {
        if (inputType == value) {
            setInputType('')
        } else {
            setInputType(value)
        }
    }

    const onCancel = () => {
        setIsLoading(false);
    }

    return (
        <div>
            {contextHolder}
            <Row style={{height: `${windowHeight}px`, color: 'white'}}>
                <Col xs={0} sm={0} md={4} lg={8} xl={8} xxl={8}>
                </Col>
                <Col xs={24} sm={24} md={16} lg={8} xl={8} xxl={8}
                     style={{background: 'linear-gradient(#2E2C42, #3B3265)'}}>
                    <div style={{height: '140px', padding: 20}}>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Link href='/home' style={{color: 'white'}}>
                                <ArrowLeftOutlined style={{fontSize: 24}}/>
                            </Link>
                            <p style={{fontSize: 18}}>Convert</p>
                            <div></div>
                        </div>
                        <p style={{fontSize: 20, marginTop: 10, color: 'white'}}>Upload your audio materials:</p>
                        <div style={{color: 'white', marginTop: 10}}>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Button: {
                                            colorPrimary: '#6BFEC9',
                                            algorithm: true,
                                        }
                                    },
                                }}
                            >
                                <Space>
                                    <MyButton buttonText='Text' onClick={() => onClickButton('text')}
                                              selected={inputType === 'text'}/>
                                    <MyButton buttonText='URL' onClick={() => onClickButton('url')}
                                              selected={inputType === 'url'}/>
                                </Space>
                            </ConfigProvider>
                        </div>
                    </div>
                    <div style={{height: '300px'}}>
                        <div style={{paddingLeft: 20, paddingRight: 20, paddingTop: 10}}>
                            <TextArea
                                style={{height: '300px', background: 'white'}}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder=''
                                defaultValue={inputType}
                            />
                        </div>
                    </div>
                    <div style={{height: `calc(${windowHeight}px - 440px)`, paddingLeft: 40, paddingRight: 40}}>
                        <div style={{height: `calc(${windowHeight}px - 520px)`}}></div>
                        <Button type='primary' shape='round' size='large'
                                style={{marginTop: 20, background: '#717171', width: 'calc(100% - 100px)'}}
                                loading={isLoading} onClick={onConvert}>Upload Audio</Button>
                        <Button type='text' shape='round' size='large' style={{color: 'white', width: '100px'}}
                                onClick={onCancel}>cancel</Button>
                    </div>
                </Col>
                <Col xs={0} sm={0} md={4} lg={8} xl={8} xxl={8}>
                </Col>
            </Row>
        </div>
    )
};

export default ConvertPage;