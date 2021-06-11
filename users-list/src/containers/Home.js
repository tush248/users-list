import React, { useState, useEffect, useCallback, useRef } from "react";
import { Table, Avatar } from "antd";
import axios from "axios";
import "antd/dist/antd.css";

import { API } from "../constants";

const Home = () => {
  const [users, setUsers] = useState([]); //To store users data fetched from api
  const [page, setPage] = useState(1); //To keep track of current page

  const totalData = useRef(10); //Taking a random value greater than 0, will reset after first api call. Only used for optimisation

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      align: "center",
      render: (url) => <Avatar src={url} />,
    },
    {
      title: "Name",
      dataIndex: "first_name",
      align: "center",
      render: (name, record) => (
        <div>
          {name} {record.last_name}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
  ];

  const getData = useCallback(async () => {
    try {
      if (users.length < totalData.current) {
        //Using this condition to prevent api calls once total data has been fetched
        const res = await axios.get(API, {
          //Refer https://www.npmjs.com/package/axios for axios usage
          params: {
            page,
          },
        });
        totalData.current = res.data.total;
        const usersList = res.data.data;
        setUsers([...users, ...usersList]);

        //Just this part also works without that condition, that condition is only used for optimisation
        // const res = await axios.get(API, {
        //   params: {
        //     page,
        //   },
        // });
        // setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    getData();
  }, [page, getData]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const paginationConfig = {
    //Configuration settings for antD pagination refer: https://ant.design/components/pagination/
    current: page,
    pageSize: 6,
    total: 12,
    onChange: handlePageChange,
  };

  return (
    <Table //Refer https://ant.design/components/table/#Table to check props
      pagination={paginationConfig}
      rowKey={(row) => row.id}
      columns={columns}
      dataSource={users}
    />
  );
};

export default Home;
