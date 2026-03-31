import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartnersModule } from './partners/partners.module';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Service } from './services/service.entity';
import { Partner } from './partners/partner.entity';
import { WebsiteContent } from './website-content/website-content.entity';
import { WebsiteContentModule } from './website-content/website-content.module';
import { Gallery } from './gallery/gallery.entity';
import { GalleryModule } from './gallery/gallery.module';
import { Statistics } from './statistics/statistics.entity';
import { StatisticsModule } from './statistics/statistics.module';
import { EmotionCreator } from './emotion-creator/emotion-creator.entity';
import { EmotionCreatorModule } from './emotion-creator/emotion-creator.module';
import { CompanyOverview } from './company-overview/company-overview.entity';
import { CompanyOverviewModule } from './company-overview/company-overview.module';
import { AboutUs } from './about-us/about-us.entity';
import { SocialLink } from './social-links/social-links.entity';
import { BlogDetail } from './blog-details/blog-details.entity';
import { AboutUsModule } from './about-us/about-us.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { BlogDetailsModule } from './blog-details/blog-details.module';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/project.entity';
import { About } from './about/about.entity';
import { Recruitment } from './recruitment/recruitment.entity';
import { Event } from './events/events.entity';
import { AboutModule } from './about/about.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { EventsModule } from './events/events.module';
import { ContactData } from './contact-data/contact-data.entity';
import { ContactDataModule } from './contact-data/contact-data.module';
import { RequestPhone } from './request-phone/request-phone.entity';
import { RequestPhoneModule } from './request-phone/request-phone.module';
import { Gala } from './gala/gala.entity';
import { GalaModule } from './gala/gala.module';
import { Mice } from './mice/mice.entity';
import { MiceModule } from './mice/mice.module';
import { TeamBuilding } from './teambuilding/teambuilding.entity';
import { TeamBuildingModule } from './teambuilding/teambuilding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MulterModule.register({
      limits: {
        fileSize: 150 * 1024 * 1024,
        files: 20,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        entities: [
          Partner,
          Service,
          WebsiteContent,
          Gallery,
          Statistics,
          EmotionCreator,
          CompanyOverview,
          AboutUs,
          SocialLink,
          BlogDetail,
          Project,
          About,
          Recruitment,
          Event,
          ContactData,
          RequestPhone,
          Gala,
          Mice,
          TeamBuilding,
        ],
        synchronize: true,
      }),
    }),
    PartnersModule,
    ServicesModule,
    WebsiteContentModule,
    GalleryModule,
    StatisticsModule,
    EmotionCreatorModule,
    CompanyOverviewModule,
    AboutUsModule,
    AboutModule,
    RecruitmentModule,
    EventsModule,
    SocialLinksModule,
    BlogDetailsModule,
    ProjectsModule,
    ContactDataModule,
    RequestPhoneModule,
    AuthModule,
    GalaModule,
    MiceModule,
    TeamBuildingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
