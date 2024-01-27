'use client';

import React, {useEffect, useState} from 'react';
import {Col, Row} from 'antd';
import {ArrowLeftOutlined, ShareAltOutlined} from '@ant-design/icons';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';


const Home: React.FC = () => {
    const [userId, setUserId] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

    const router = useRouter();
    const param = useSearchParams();

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

    return (
        <div>
            <Row style={{height: `${windowHeight}px`, color: 'white'}}>
                <Col xs={0} sm={0} md={4} lg={8} xl={8} xxl={8}>
                </Col>

                <Col xs={24} sm={24} md={16} lg={8} xl={8} xxl={8}
                     style={{background: 'linear-gradient(#2A1E44, #5F6192)'}}>
                    <div style={{height: `${window.innerHeight}px`, padding: 20}}>
                        <div style={{display: 'flex', marginTop: 4, justifyContent: 'space-between'}}>
                            <Link href='/home' style={{color: 'white'}}>
                                <ArrowLeftOutlined style={{fontSize: 24}}/>
                            </Link>
                            <p style={{fontSize: 18}}>{param.get('title')}</p>
                            <ShareAltOutlined style={{fontSize: 24}}/>
                        </div>

                        <div style={{display: 'flex', marginTop: 40, marginBottom: 20, justifyContent: 'center'}}>
                            <img alt='image' src={'bg.jpg'}
                                 style={{
                                     borderRadius: '50%',
                                     width: '60%',
                                     objectFit: 'cover',
                                     border: '5px solid #0D8CE9'
                                 }}/>
                        </div>
                        <div style={{display: 'flex', marginTop: 40, marginBottom: 10, justifyContent: 'center'}}>
                            <audio controls
                                   src={((process.env.apiUrl ?? '') + param.get('audioUrl')).replace('./', '/') ?? ''}></audio>
                        </div>
                    </div>
                </Col>

                <Col xs={0} sm={0} md={4} lg={8} xl={8} xxl={8}>
                </Col>
            </Row>
        </div>
    )
};

export default Home;