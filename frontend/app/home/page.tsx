'use client';

import React, {useEffect, useState} from 'react';
import {Col, Row, Button, message} from 'antd';
import {UploadOutlined, LogoutOutlined} from '@ant-design/icons';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

interface Podcast {
    id: number;
    title: string;
    podcast_text: string;
    summary_text: string;
    audio_file_url: string;
    summary_audio_file_url: string;
    creation_time: string;
    completion_time: string;
    json_obj: string;
}

const Home: React.FC = () => {
    const [userId, setUserId] = useState(0);
    const [podcastArray, setPodcastArray] = useState<Podcast[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [windowHeight, setWindowHeight] = useState(0);

    const router = useRouter();
    const fetchData = async (curUserId: number) => {
        try {
            const res = await fetch(process.env.apiUrl + '/podcast/' + curUserId);
            if (!res.ok) {
                messageApi.error('Failed to fetch data');
            }
            const resData = await res.json();
            if (resData['success']) {
                let dataArray = resData['podcasts'];
                if (dataArray.length === 0) {
                    dataArray = [{
                        id: 0,
                        title: 'audio example',
                        podcast_text: 'audio example',
                        summary_text: 'audio example',
                        audio_file_url: '',
                        summary_audio_file_url: 'faae33d0-7449-42c7-97bf-21c77beb3e06.mp3',
                        creation_time: '2024-01-18T16:23:12.620014',
                        completion_time: '2024-01-18T16:23:26.042663',
                        json_obj: ''
                    }]
                }
                setPodcastArray(dataArray);
            } else {
                messageApi.error(resData['message']);
            }
        } catch (error) {
            messageApi.error('Error fetching data.');
        }
    };

    useEffect(() => {
        setWindowHeight(window.innerHeight);
    }, []);

    useEffect(() => {
        const localUserId = parseInt(localStorage.getItem('podcast-ai-user-id') ?? '0')
        setUserId(localUserId)
        if (localUserId === 0) {
            router.push('/')
        } else {
            fetchData(localUserId);
        }
    }, [userId])



    const onLogOut = () => {
        localStorage.removeItem('podcast-ai-user-id');
        setUserId(0);
    }

    return (
        <div>
            {contextHolder}
            <Row style={{height: `${windowHeight}px`, color: 'white'}}>
                <Col xs={0} sm={0} md={4} lg={8} xl={8} xxl={8}>
                </Col>

                <Col xs={24} sm={24} md={16} lg={8} xl={8} xxl={8}>
                    <div style={{
                        height: `${windowHeight}px`,
                        background: 'linear-gradient(#2E2C42, #3F3569)',
                        overflowY: 'auto'
                    }}>
                        <div style={{padding: 20}}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div></div>
                                <p style={{fontSize: 24}}>podcast-ai</p>
                                <LogoutOutlined style={{fontSize: 24}} onClick={onLogOut}/>
                            </div>

                            <div>
                                <p style={{fontSize: 20, marginBottom: 10, color: 'white'}}>Recent</p>
                                {podcastArray.slice(0, 3).map((podcast, index) => (
                                    <div key={index} style={{
                                        background: '#464467', height: '62px', borderRadius: 10, marginBottom: 10,
                                        padding: 10
                                    }}>
                                        <Link href={{
                                            pathname: '/play',
                                            query: {audioUrl: podcast.summary_audio_file_url, title: podcast.title}
                                        }} style={{color: 'white'}}>
                                            <p>{podcast.title}</p>
                                            <div style={{
                                                display: 'flex',
                                                marginTop: 4,
                                                justifyContent: 'space-between'
                                            }}>
                                                <div style={{
                                                    color: '#909098',
                                                    fontSize: 12
                                                }}>{podcast.creation_time}</div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p style={{fontSize: 20, marginBottom: 10, color: 'white'}}>Your Library</p>
                                {podcastArray.map((podcast, index) => (
                                    <div key={index} style={{
                                        background: '#464467', height: '62px', borderRadius: 10, marginBottom: 10,
                                        padding: 10
                                    }}>
                                        <Link href={{
                                            pathname: '/play',
                                            query: {audioUrl: podcast.summary_audio_file_url, title: podcast.title}
                                        }} style={{color: 'white'}}>
                                            <p>{podcast.title}</p>
                                            <div style={{
                                                display: 'flex',
                                                marginTop: 4,
                                                justifyContent: 'space-between'
                                            }}>
                                                <div style={{
                                                    color: '#909098',
                                                    fontSize: 12
                                                }}>{podcast.creation_time}</div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div style={{width: '100%'}}>
                                <Link href='/convert'>
                                    <Button type='primary' shape="round" icon={<UploadOutlined/>}
                                            style={{
                                                marginTop: 20,
                                                background: '#8B64D2',
                                                fontWeight: 400,
                                                width: '100%'
                                            }}>New Audio
                                    </Button>
                                </Link>
                            </div>
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