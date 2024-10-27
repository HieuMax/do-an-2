import React from 'react';
import { Col, Row, Statistic } from 'antd';
import CountUp from 'react-countup';
const formatter = (value) => <CountUp end={value} separator="," />;
export const ReportPage = () => {

    return (
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Số lượng đề tài" value={5} formatter={formatter} />
          </Col>
          <Col span={12}>
            <Statistic title="Account Balance (CNY)" value={112893} precision={2} formatter={formatter} />
          </Col>
        </Row>
      );
}
// export default ReportPage;