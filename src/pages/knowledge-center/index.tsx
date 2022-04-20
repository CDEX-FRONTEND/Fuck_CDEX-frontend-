/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, Suspense } from 'react';
import { Redirect, useHistory } from 'react-router';
import RoundedLayout from '../../components/RoundedLayout';
import KnowledgeCenterArticles from './articles';
import KnowledgeCenterPopular from './popular';
import PopularIcon from '../../icons/PopularIcon.svg';
import ArticlesIcon from '../../icons/ArticleIcon.svg';
import NewsIcon from '../../icons/NewsIcon.svg';
import InstructionIcon from '../../icons/InstructionIcon.svg';
import QuestionsAndAnswersIcon from '../../icons/QuestionsAndAnswersIcon.svg';
import PopularIconGold from '../../icons/PopularIconGold.svg';
import ArticlesIconGold from '../../icons/ArticleIconGold.svg';
import NewsIconGold from '../../icons/NewsIconGold.svg';
import InstructionIconGold from '../../icons/InstructionIconGold.svg';
import QuestionsAndAnswersIconGold from '../../icons/QuestionsAndAnswersIconGold.svg';
import Toolbar from '../../components/Toolbar';
import { useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import View from '../../components/View';
import { Container, Box } from '@mui/material';
import MobileTabs from './MobileTabs';
import TabItem from './TabItem';

interface ITab {
  label: string;
  component?: JSX.Element;
  path?: string;
  icon: {
    default: string;
    active: string;
  };
}

const KnowledgeCenter = () => {
  const { authenticated } = useAuth();
  const location = useLocation();
  const tabs: ITab[] = [
    {
      label: 'Популярное',
      component: <KnowledgeCenterPopular />,
      path: '/knowledge-center/popular',
      icon: {
        default: PopularIcon,
        active: PopularIconGold,
      },
    },
    {
      label: 'Статьи',
      component: <KnowledgeCenterArticles />,
      path: '/knowledge-center/articles',
      icon: {
        default: ArticlesIcon,
        active: ArticlesIconGold,
      },
    },
    {
      label: 'Новости',
      icon: {
        default: NewsIcon,
        active: NewsIconGold,
      },
    },
    {
      label: 'Инструкция',
      icon: {
        default: InstructionIcon,
        active: InstructionIconGold,
      },
    },
    { 
      label: 'Вопросы и ответы',
      icon: {
        default: QuestionsAndAnswersIcon,
        active: QuestionsAndAnswersIconGold,
      }
    },
  ];

  const [currentTab, setCurrentTab] = useState<ITab | undefined>(
    tabs.find((t) => location.pathname.indexOf(`${t.path}`) === 0)
  );
  const history = useHistory();

  const isActiveTab = (checkingTab: ITab) => {
    return currentTab?.label === checkingTab.label;
  };

  const changeCurrentTab = (newTab: ITab) => {
    setCurrentTab(newTab);
    newTab.path && newTab.path !== currentTab?.path &&
      history.push(newTab.path);
  };

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <Box
            display="flex"
            sx={{
              flexDirection: {
                md: 'row',
                xs: 'column',
              }
            }}
          >
            <Box
              p="24px"
              sx={{
                borderRight: {
                  xs: 'none',
                  md: '1px solid #D9D9D9',
                },
                borderBottom: {
                  xs: '1px solid #D9D9D9',
                  md: 'none',
                },
              }}
            >
              <Box
                position="relative"
                mb="15px"
                sx={{
                  display: {
                    xs: 'none',
                    md: 'table',
                  },
                }}
              >
                {tabs.map((item, index) => (
                  <TabItem
                    key={index}
                    icon={isActiveTab(item) ? item.icon.active : item.icon.default}
                    label={item.label}
                    isActive={isActiveTab(item)}
                    onClick={() => changeCurrentTab(item)}
                  />
                ))}
              </Box>
              <Box
                sx={{
                  display: {
                    xs: 'block',
                    md: 'none',
                  }
                }}
              >
                <MobileTabs
                  tabs={tabs}
                  tab={currentTab}
                  changeCurrentTab={changeCurrentTab}
                />
              </Box>
            </Box>
            <Box
              p="24px"
              display="flex"
              justifyContent="center"
              flexDirection="column"
            >
                {currentTab?.component}
            </Box>
          </Box>
        </RoundedLayout>
      </Container>
    </View>
  );
};

export default KnowledgeCenter;
