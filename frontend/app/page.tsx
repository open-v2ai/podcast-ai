'use client';

import React, {useEffect, useState} from 'react';
import {Col, Row, Button, Input, message} from 'antd';
import {MailOutlined} from '@ant-design/icons';
import {useRouter} from 'next/navigation';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [userId, setUserId] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    
    const router = useRouter();

    useEffect(() => {
        setWindowHeight(window.innerHeight);
    }, []);

    useEffect(() => {
        const localUserId = parseInt(localStorage.getItem('podcast-ai-user-id') ?? '0')
        setUserId(localUserId)
        if (localUserId !== 0) {
            router.push('/home')
        } else {
            router.push('/')
        }
    }, [router, userId])

    const onClick = async () => {
        console.log(email);
        setIsLoading(true);
        if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/.test(email)) {
            messageApi.info('Please wait...');

            const res = await fetch(process.env.apiUrl + '/login/' + email)
            if (!res.ok) {
                messageApi.error('Failed to fetch data')
            }
            const resData = await res.json()
            if (resData['success']) {
                localStorage.setItem('podcast-ai-user-id', resData['user_id']);
                router.push('/home');
            } else {
                messageApi.error(resData['message']);
            }
        } else {
            messageApi.error(`Not valid email: ${email}`);
        }
        setIsLoading(false);
    }

    return (
        <div>
            {contextHolder}
            <Row style={{height: `${windowHeight}px`, color: 'white'}}>
                <Col xs={0} sm={0} md={4} lg={8} xl={8} xxl={8}>
                </Col>

                <Col xs={24} sm={24} md={16} lg={8} xl={8} xxl={8}
                     style={{background: 'linear-gradient(#2A1E44, #5F6192)'}}>
                    <div style={{height: `${windowHeight}px`, padding: 20}}>
                        <div style={{display: 'flex', marginTop: 4, justifyContent: 'center'}}>
                            <p style={{fontSize: 18}}>podcast-ai</p>
                        </div>
                        <div style={{padding: 40}}>
                            <Input addonBefore={<MailOutlined style={{color: 'white'}}/>}
                                   style={{width: '100%', marginTop: '40%'}}
                                   size={'large'} onChange={(e) => setEmail(e.currentTarget.value)}/>
                            <Button shape='round'
                                    style={{width: '100%', marginTop: 40, background: '#6BFEC9', color: 'gray'}}
                                    size={'large'} onClick={onClick} loading={isLoading}>Log in</Button>
                        </div>
                    </div>
                </Col>
                <Col xs={0} sm={0} md={4} lg={8} xl={8} xxl={8}>
                </Col>
            </Row>
        </div>
    )
};


export default Login;
