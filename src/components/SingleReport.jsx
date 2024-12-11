import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import ReportService from '../services/ReportService';
import BackToTopButton from './BackToTopButton';
import { Footer } from '.';
import styles from '../style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const ReportArtwork = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [report, setReport] = useState();

    const { reportId } = useParams()


    useEffect(() => {
        const fetchReports = async () => {
            try {
                setIsLoading(true);
                const reportById = await ReportService.getReportById(reportId);;
                setReport(reportById?.data); // Assuming the reports are in response.data
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setIsLoading(false);
            }
        };

        fetchReports();
    }, []);

    console.log(report?.data, 'report')
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-200 text-4xl mr-2" style={{ fontSize: '2rem' }} />
                {/* <span className="text-gray-200 text-xl">...</span> */}
            </div>
        );
    }
    return (
        <div className='shadow'>
            <div className="3/4 p-4 text-center text-white">
                <h2 className="font-bold text-lg mb-2">Reported Artwork</h2>
            </div>
            <div className='flex justify-center '>
                {report?.data?.reportable?.feature_image.includes('.mp4') ? (
                    <video
                        src={`https://api.muralfinder.net${report?.data?.reportable?.feature_image}`}
                        alt="Artwork"
                        className="md:h-56 object-cover"
                        controls
                    />
                ) : (
                    <img
                        src={`https://api.muralfinder.net${report?.data?.reportable?.feature_image}`}
                        alt="Artwork"
                        className="md:h-56 object-cover"
                    />
                )}
            </div>
            <div className="flex flex-col items-center  p-5 bg-transparent">
                <div>

                </div>
                <section className={`${styles.paddingX} w-full md:w-1/2 px-4`}>
                    <div className="flex flex-col justify-center items-center mt-5">
                        <p className="text-white text-lg md:text-xl font-semibold text-center bg-opacity-60 p-4 rounded-lg shadow-lg max-w-full">
                            Reason: <span className="font-normal">{report?.data?.reason}</span>
                        </p>
                    </div>
                    <button className="my-7 py-2 px-4 text-white w-full p-4 rounded border border-blue-300">
                        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin size="1x" className="mr-2" /> : 'Delete'}
                    </button>
                </section>
            </div>

            <div className={`${styles.flexCenter} flex-col mb-0 mt-2`}><Footer /></div>
            <BackToTopButton />
        </div>
    )
}

export default ReportArtwork