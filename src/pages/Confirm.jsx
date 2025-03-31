import React, { useEffect, useState } from 'react';
import { Result, Button, Card, Typography, Descriptions, Spin, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

function Confirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    const handlePaymentResult = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
        // Extract package ID from order info string
        const orderInfo = queryParams.get('vnp_OrderInfo');
        const packageId = orderInfo ? orderInfo.split('_')[1] : null;

        if (vnp_ResponseCode === '00') {
          const result = await api.payment.processPaymentReturn(queryParams);
          
          if (result.success) {
            // Get package details only if we have packageId
            let packageName = 'Unknown Package';
            if (packageId) {
              try {
                const packageDetails = await api.membership.getPackageById(packageId);
                packageName = packageDetails.name;
              } catch (err) {
                console.error('Failed to get package details:', err);
              }
            }
            
            // Format VNPay payment date
            const paymentDate = queryParams.get('vnp_PayDate');
            const formattedPaymentDate = paymentDate ? 
              `${paymentDate.slice(0,4)}-${paymentDate.slice(4,6)}-${paymentDate.slice(6,8)} ${paymentDate.slice(8,10)}:${paymentDate.slice(10,12)}:${paymentDate.slice(12,14)}`
              : new Date().toISOString();
            
            setPaymentStatus('success');
            setTransactionDetails({
              packageName: packageName,
              amount: parseInt(queryParams.get('vnp_Amount')) / 100,
              transactionId: queryParams.get('vnp_TransactionNo'),
              paymentDate: formattedPaymentDate,
              bankCode: queryParams.get('vnp_BankCode'),
            });
            message.success('Thanh toán thành công! Gói dịch vụ của bạn đã được kích hoạt.');
          } else {
            throw new Error('Xác thực thanh toán thất bại');
          }
        } else {
          setPaymentStatus('failed');
          message.error('Thanh toán thất bại: Giao dịch bị từ chối');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setPaymentStatus('failed');
        message.error(error.message || 'Đã xảy ra lỗi trong quá trình xử lý thanh toán.');
      }
    };

    if (location.search) {
      handlePaymentResult();
    } else {
      navigate('/feepackage');
    }
  }, [location.search, navigate]);

  const handleBackHome = () => {
    navigate('/');
  };

  const handleViewSubscription = () => {
    navigate('/subscription-history');
  };

  if (!paymentStatus) {
    return <div style={{ textAlign: 'center', padding: '40px' }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <Result
        icon={paymentStatus === 'success' ? 
          <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
        title={paymentStatus === 'success' ? "Thanh Toán Thành Công!" : "Thanh Toán Thất Bại"}
        subTitle={paymentStatus === 'success' ? 
          "Cảm ơn bạn đã mua hàng. Giao dịch của bạn đã hoàn tất." :
          "Xin lỗi, thanh toán không thể hoàn tất. Vui lòng thử lại."}
        extra={[
          <Button type="primary" key="home" onClick={handleBackHome}>
            Về Trang Chủ
          </Button>,
          paymentStatus === 'success' && (
            <Button key="subscription" onClick={handleViewSubscription}>
              Xem Lịch Sử Đăng Ký
            </Button>
          )
        ]}
      />

      {paymentStatus === 'success' && transactionDetails && (
        <Card style={{ marginTop: '24px' }}>
          <Title level={4}>Chi Tiết Thanh Toán</Title>
          <Descriptions column={1}>
            <Descriptions.Item label="Gói Dịch Vụ">
              {transactionDetails.packageName}
            </Descriptions.Item>
            <Descriptions.Item label="Số Tiền">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(transactionDetails.amount)}
            </Descriptions.Item>
            <Descriptions.Item label="Mã Giao Dịch">
              {transactionDetails.transactionId}
            </Descriptions.Item>
            <Descriptions.Item label="Ngân Hàng">
              {transactionDetails.bankCode}
            </Descriptions.Item>
            <Descriptions.Item label="Thời Gian Thanh Toán">
              {new Date(transactionDetails.paymentDate).toLocaleString('vi-VN')}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  );
}

export default Confirm;