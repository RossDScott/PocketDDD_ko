using PocketDDD.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PocketDDD.Services
{
    public class HardCodedDataService
    {
        public IList<DDDEvent> GetEvents(int currentVersion)
        {
            //if (currentVersion >= 3)
            //    return new List<DDDEvent>();

            return new List<DDDEvent>{
                new DDDEvent{Id=1,Name="DDDSW 5", City="Bristol",Date = new DateTime(2014,05,17),Version=5, IsActive=true}
            };
        }

        public DDDEventDetail GetEventDetail(int currentVersion)        {
            //if (currentVersion >= 3)
            //    return null;

            return new DDDEventDetail{
                    DDDEventId = 1,
                    Tracks = new List<Track>{
                        new Track{Id = 1, Name = "Track 1", RoomName="Room 212"},
                        new Track{Id = 2, Name = "Track 2", RoomName="Room 202"},
                        new Track{Id = 3, Name = "Track 3", RoomName="Room 203"},
                        new Track{Id = 4, Name = "Track 4", RoomName="Room 208"}
                    },
                    TimeSlots = new List<TimeSlot>{
                        new TimeSlot{Id = 1, From= new DateTime(2014,05,17,08,30,0), To=new DateTime(2014,05,17,09,10,0), Info= "Registration"},
                        new TimeSlot{Id = 2, From= new DateTime(2014,05,17,09,10,0), To=new DateTime(2014,05,17,09,20,0), Info= "Welcome & Housekeeping"},
                        new TimeSlot{Id = 3, From= new DateTime(2014,05,17,09,30,0), To=new DateTime(2014,05,17,10,30,0), Info= null},
                        new TimeSlot{Id = 4, From= new DateTime(2014,05,17,10,30,0), To=new DateTime(2014,05,17,10,50,0), Info= "Break (Tea/Coffee)"},
                        new TimeSlot{Id = 5, From= new DateTime(2014,05,17,10,50,0), To=new DateTime(2014,05,17,11,50,0), Info= null},
                        new TimeSlot{Id = 6, From= new DateTime(2014,05,17,11,50,0), To=new DateTime(2014,05,17,12,10,0), Info= "Break (Tea/Coffee)"},
                        new TimeSlot{Id = 7, From= new DateTime(2014,05,17,12,10,0), To=new DateTime(2014,05,17,13,10,0), Info= null},
                        new TimeSlot{Id = 8, From= new DateTime(2014,05,17,13,10,0), To=new DateTime(2014,05,17,14,40,0), Info= "Lunch (Pasties)"},
                        new TimeSlot{Id = 9, From= new DateTime(2014,05,17,14,40,0), To=new DateTime(2014,05,17,15,40,0), Info= null},
                        new TimeSlot{Id = 10, From= new DateTime(2014,05,17,15,40,0), To=new DateTime(2014,05,17,16,00,0), Info= "Break (Cream Teas)"},
                        new TimeSlot{Id = 11, From= new DateTime(2014,05,17,16,00,0), To=new DateTime(2014,05,17,17,00,0), Info= null},
                        new TimeSlot{Id = 12, From= new DateTime(2014,05,17,17,00,0), To=new DateTime(2014,05,17,17,20,0), Info= "Closing + Prizes"}
                    },
                    Sessions = new List<Session>{
                        new Session{Id = 1, DDDEventId=1, TimeSlotId=3, TrackId=1, Title="Architecting large Single Page Applications with Knockout.js", Speaker="Steve Sanderson",
                        ShortDescription=@"Everybody's into rich JavaScript applications these days, but how do you get beyond ""hello world"" and build something large, maintainable, and performant? In this talk, I demonstrate pros and cons of various techniques and technology choices, including powerful new features coming to Knockout.js.",
                        FullDescription=@"These days it's easy to get started building a Single Page Application (SPA). Dozens of frameworks are clamouring to pitch their trivial ""hello world"" and ""todo list"" examples. But the moment you step outside the predefined path and begin actually crafting something for a real business, you face an explosion of choices.
This talk is about experiences of building large SPAs and maintaining them over time. In part, I'll demonstrate pros and cons of various technology choices, such as TypeScript, Grunt, and AMD module optimisers. In part, I'll demonstrate some Knockout.js-specific techniques, such as the new and powerful ""components"" feature that improves maintenance, testability, and runtime performance.
Throughout, I'll share lessons learned from building and maintaining the core of the Windows Azure management portal, an exceptionally large and high-profile SPA whose various parts are developed by many different teams within Microsoft. I hope these experiences will prove useful when you build your next rich JavaScript application."},
                        new Session{Id = 2, DDDEventId=1, TimeSlotId=3, TrackId=2, Title="Continuous Integration, in an hour, on a shoestring", Speaker="Phil Collins",
                        ShortDescription=@"In one hour we'll investigate Continuous Integration and what it can do for your team. We'll build a TeamCity to server to pick up builds from a local Git repo. Then we'll add in YouTrack and get the whole think linking together.",
                        FullDescription=@"With the help of some virtual machines we'll install, from scratch, a free version of Team City. We'll then spin up another VM and install YouTrack. Add in a Git repo and tie that up together. Before the end of the session we'll have TeamCity firing a build after pushing changes from the Git repo, factoring in details of the fix from a support ticket we've logged in YouTrack."},
                        new Session{Id = 3, DDDEventId=1, TimeSlotId=3, TrackId=3, Title="​Introduction to development with ASP.Net MVC 5", Speaker="David Ringsell",
                        ShortDescription=@"An introduction to MVC including the benefits and the design pattern. Demonstration of creating an business  application.",
                        FullDescription=@"MVC applications offer a clean separation of concerns between the business-logic, web pages and the controller. Microsoft ASP.NET MVC 4 offers Web developers all the benefits of MVC allied with all the power of the .NET platform. This talk is an introduction to MVC including the benefits and the design pattern."},
                        new Session{Id = 4, DDDEventId=1, TimeSlotId=3, TrackId=4, Title="It doesn't work that way in enterprise", Speaker="Pete Smith",
                        ShortDescription=@"One man's story about the trials and tribulations of being an 'enterprise' developer. If you think you've experienced corporate dogma and constraint - the extent of it in this tale will put everything in perspective! I'll also give you proof that despite what anyone says, things can get better.",
                        FullDescription=@"We've all heard it... or something similar. There's probably one senior guy at work who tells you this at least once a month. You've got an idea for an amazing new feature or practice that's going to save your company both time and money, but it's too 'cutting edge'; your management fears the unfamiliar and you are cruelly stifled.
""It doesn't work like that in Enterprise"" is a passionate and motivational story about my journey as a developer in the face of one of the worst fallacies in our industry. The extremes of my experience will make you laugh & cry in equal measure, and maybe help put your own frustrations into perspective. Just remember, it does get better... and you probably got off very f***g lightly!"},
                        
                        
                        new Session{Id = 5, DDDEventId=1, TimeSlotId=5, TrackId=1, Title="Federated Identity - enabling single sign-on across all your apps and systems ", Speaker="Stephen Askew",
                        ShortDescription=@"Do you despair when asked to create another password? So do your customers. Most people have a Microsoft, Google or Facebook account and most businesses have Active Directory, so why not use them? Come and learn the concept of federating identity authentication and how to implement it in your apps.",
                        FullDescription=@"Cloud computing is becoming the default for new applications, both for consumers and businesses. Many of these apps and systems need to identify users in some way, but don't have access to other back-end systems, such as Active Directory. Equally, building bespoke user management into every application isn't particularly efficient or secure.

A much better option is Identity Federation, which enables you to manage user identity securely across application and network boundaries. From your users' perspective, it means they won't need to remember yet another password to use your system or app.
This session will explain how federated identity works and why you should be using it. It will then show you how to use it with the new OWIN Identity framework in ASP.NET, also taking a look at Azure Active Directory."},
                        new Session{Id = 6, DDDEventId=1, TimeSlotId=5, TrackId=2, Title="Complexity => Simplicity", Speaker="Ashic Mahtab",
                        ShortDescription=@"We are building increasingly complex systems. Quite often, they start off quite simple, and we follow ""best practices"". Soon enough, they turn into unmanageable behemoths that everybody is scared of touching. In this session, we will look at ways to prevent this from happening. Theory & code ahoy!!",
                        FullDescription=@"We have so many tricks up our sleeve. We have TDD, DDD, repositories, services, DDD, nHibernate, Entity Framework, Web API, REST, SPAs - the list goes on, and on, and on, and on. It is easier than ever to File > New Project and get productive quickly. What is much harder is maintaining the level of productivity in the face of change. We know refactoring, and it sometimes helps. We have tests, but they sometimes cause a great deal of overhead when things evolve. We understand OOP, or do we? FP promises so much - surely it's so much better than OO, no?

Quite often, it is not the tools and practices in use, but fundamental programming practices that are at fault. In our pursuit of the shiny we end up creating nightmares. We mortgage the present for the future, but as technical debt increases, so does the interest rate - and we lose both.

In this session, we will look at some of the things that can help us  hedge against debt - ways of keeping it manageable. We will start off with a code example - a representative scenario that we see quite often. We will refactor the code to improve cohesion and reduce coupling. We will see how our actions make things not only more maintainable, but also increase scalability and performance. We will touch on concepts like Domain Driven Design, CQRS, Event Sourcing, SOA, messaging, and core OO."},
                        new Session{Id = 7, DDDEventId=1, TimeSlotId=5, TrackId=3, Title="7 Top Tips - A full stack ASP.NET MVC5 EF6 Testable application", Speaker="Dave Mateer",
                        ShortDescription=@"A full walkthrough of a real life, well architected and testable application - showing the 7 tops tips I've learned.  Including TDD, BDD, IoC, UoW, ViewModels, AutoMapper, MVC5, EF6, Validation, Exception handling and Azure.  The application is a humour website - so expect so great jokes!",
                        FullDescription=@"What is says in synopsis…"},
                        new Session{Id = 8, DDDEventId=1, TimeSlotId=5, TrackId=4, Title="Redis cluster - everything you need to know", Speaker="Marc Gravell",
                        ShortDescription=@"2014 sees the release of redis 3, bringing truly and integrated ""scale out"" cluster capability into the already excellent data store. This session offers a dive into creating and using a cluster of redis 3 nodes.",
                        FullDescription=@"Redis is a high performance key-value store used by countless companies and sites. 2014 sees the release of the new ""cluster"" features, which bring true scale-out capability into the already excellent product.
This session takes a look at the motivations and advantages of redis cluster, shows you how to create a cluster of redis nodes, and demonstrates how to talk to a redis cluster whether from the comand-line, or from applications via libraries.
Code examples will be using C#, but libraries are available for most technology stacks."},

                        new Session{Id = 9, DDDEventId=1, TimeSlotId=7, TrackId=1, Title="Real-time geospatial visualisation with SignalR and OpenLayers", Speaker="Martin Thornalley",
                        ShortDescription=@"It's now easy to build real-time geospatial visualisation web applications. The abundance of open source technologies allows you, the developer, to create highly functional and visually impressive web applications with only minimal code. Come along to this session to see if you agree.",
                        FullDescription=@"Visualising real-time geospatial data clearly has many uses, from the obvious such as displaying live road traffic data to the topical such as communicating live river level telemetry.
Building web applications to perform these tasks has traditionally not been that straight forward.  However, with the recent development of real-time web technologies like WebSockets, and the release of both client and server-side libraries that can make them simple to use, it's now relatively easy to build this class of web application.
In this session we'll build a web application to geospatially visualise a real-time streaming API using ASP.NET Signal R, OpenLayers and AngularJS (amongst others) and we'll deploy the code to Azure for good measure so we can make the session even more interactive."},
                        new Session{Id = 10, DDDEventId=1, TimeSlotId=7, TrackId=2, Title="Introduction to S.O.L.I.D", Speaker="Colin Angus Mackay",
                        ShortDescription=@"An introduction to the SOLID principles for those new to the topic. A basic understanding of OO is assumed. Examples are in C#",
                        FullDescription=@"An introduction to the 5 S.O.L.I.D. principles (Single Reponsibility Principle, Open/Closed Principle, Liskov Substitution Principle, Interface Segregation Principle, and Dependency Inversion Principle). In this session we'll take basic OO concepts and expand on them to give a grounding in the SOLID principles.
The examples are in C#, but the concepts can apply to any OO language."},
                        new Session{Id = 11, DDDEventId=1, TimeSlotId=7, TrackId=3, Title="F# Eye for the C# Guy", Speaker="Phil Trelford",
                        ShortDescription=@"This talk is for C# programmers who are curious about F#, a mature multi-paradigm programming language available in Visual Studio and Xamarin Studio.",
                        FullDescription=@"This talk is for C# programmers who are curious about F#, a mature multi-paradigm programming language available in Visual Studio and Xamarin Studio.
In: unit testing, functions and classes
Out: maths, monads and moth-eaten jumpers
Expect live code samples, including interop between C# and F#."},
                        new Session{Id = 12, DDDEventId=1, TimeSlotId=7, TrackId=4, Title="Super charging your JavaScript development experience", Speaker="Chris Canal",
                        ShortDescription=@"With the release of V8 and subsequently NodeJs, JavaScript has started to grow up.  In this session we will look at how you can super charge your JavaScript development lifecycle and deliver better written, cleaner and more coherent JavaScript with and without VisualStudio",
                        FullDescription=@"With the release of V8 and subsequently NodeJs, JavaScript has started to grow up.  In this session we will look at how you can super charge your JavaScript development lifecycle and deliver better written, cleaner and more coherent JavaScript with and without VisualStudio

We will look at the many awesome frameworks for infrastructurally support when developing JavaScript applications like Yeoman, Gulp, grunt, Browserfy as well as the new tools being released by Microsoft"},

                        new Session{Id = 13, DDDEventId=1, TimeSlotId=9, TrackId=1, Title="Hadoop and Big Data for Microsoft Developers", Speaker="Gary Short",
                        ShortDescription=@"Hadoop has quickly become the defacto standard for big data processes, but most of the information on Hadoop would leave a C# developer thinking it's not for them, this session will change that view.",
                        FullDescription=@"Hadoop is the defacto standard for big data processes. If you are a C# developer you would be forgiven for thinking this platform is not for you. This session will change your mind as we look at solving some real world data science problems using C# and Hadoop for Windows."},
                        new Session{Id = 14, DDDEventId=1, TimeSlotId=9, TrackId=2, Title="Software Craftsmanship: Raising the bar, elitist or just snake oil?", Speaker="Ian Russell",
                        ShortDescription=@"In this session you will learn about the aims of Software Craftmanship and how they are actually being delivered and perceived in the real world.",
                        FullDescription=@"Our industry, and by implication us as software developers, does not have the greatest of reputations!  The Software Craftmanship movement (cult?) has been an attempt to remedy this impression.  Can Software Craftmanship actually make a difference or is it going to turn into Scrum for developers where you can buy certification to describe yourself as an expert? In this session you will learn about the aims of Software Craftmanship and how they are actually being delivered and perceived in the real world."},
                        new Session{Id = 15, DDDEventId=1, TimeSlotId=9, TrackId=3, Title="An Introduction to Nancy", Speaker="Mathew McLoughlin",
                        ShortDescription=@"I will be giving an introduction to the Nancy framework, going over some of the basics and trying to explain why it is a good choice for any new or existing applications.",
                        FullDescription=@"For those of you who haven't heard of it, Nancy is a lightweight framework for building HTTP based services. Basically it's an alternative to ASP.NET MVC and WebAPI. In this talk I will give an introduction to the framework showing you how to create a basic CRUD application and highlighting some of Nancy's advantages along the way. I will be going over the basics of:
Routing and route arguments
Model binding and validation
View engine and how to return views
Content negotiation
Dependency injection
Testing
I'll then finish up by showing you how to integrate Nancy into an existing ASP.NET Application."},
                        new Session{Id = 16, DDDEventId=1, TimeSlotId=9, TrackId=4, Title="Designing for mobile (AKA Designing for Everything)", Speaker="George Adamson",
                        ShortDescription=@"Never mind the ""mobile web"", we're designing for all-sorts. It's all just a blur of devices and screen sizes. This session explores the issues & tech solutions of attempting to design for everything. Everything from media-queries to touching (but not in a weird way ;)",
                        FullDescription=@"What is says in synopsis…"},

                        new Session{Id = 17, DDDEventId=1, TimeSlotId=11, TrackId=1, Title="10 things I learnt about web application security being pen tested by banks", Speaker="James Crowley",
                        ShortDescription=@"As a web developer we know we should do more when it comes to security - but what to focus on with limited time? I'll share what I've learnt being pen tested by major banks, give some practical steps to improve your web application security and some specific gotcha's to watch out for along the way.",
                        FullDescription=@"You hash your passwords, SQL injection is no problem with your shiny ORM, and ASP.NET protects you from nasty input in your form submissions. That's security covered, right? As a web developer we know there's more to it than that, but where do you start?
I'll share what I've learnt from working at the coalface - a startup building web applications in the finance space being pen tested by major banks. I'll arm you with:
best practices from web.config settings, user authentication & SSL configuration
approaches to addressing request forgery and cross site scripting
tools and resources to scan your own application
gotcha's with file uploads, user input and much more.
Hopefully you'll come away not only with more knowledge but some practical steps you can apply to your own applications right away."},
                        new Session{Id = 18, DDDEventId=1, TimeSlotId=11, TrackId=2, Title="Top 5 mistakes Enterprise developers make when going mobile", Speaker="Stephen Ball",
                        ShortDescription=@"Going mobile is more and more important as Enterprises mobilise their work forces, but getting it right is often harder than it might sound. These guiding priciples will help you get a good headstart and avoid some of the pitfuls along the way.",
                        FullDescription=@"Every developer must go mobile! Even mission critical desktop apps and large-scale enterprise systems extend their reach with on-the-go mobile app versions. You too can create an awesome mobile user experience for your app and we've prepared a list of 5 common mistakes that developers make when taking Enterprise functionality mobile - and how you can avoid them! - This session was previously presented at AppsWorld (London) and Java2Days (Bulgaria)"},
                        new Session{Id = 19, DDDEventId=1, TimeSlotId=11, TrackId=3, Title="A gentle introduction to AngularJS", Speaker="Mauro Servienti",
                        ShortDescription=@"JS and HTML has come to a new life, in this talk we'll see how we can develop a Single Page Application (SPA) using one of the most powerful toolkit out there: AngularJS. We'll start introducing AngularJS concepts and core components and then move on building our sample app using WebAPI as backend.",
                        FullDescription=@"JS and HTML has come to a new life, in this talk we'll see how we can develop a Single Page Application (SPA) using one of the most powerful toolkit out there: AngularJS. We'll start introducing AngularJS concepts and core components and then move on building our sample app using WebAPI as backend."},
                        new Session{Id = 20, DDDEventId=1, TimeSlotId=11, TrackId=4, Title="Writing better CSS with LESS", Speaker="Andy Gibson",
                        ShortDescription=@"CSS frameworks, grid layouts and pre-processors have been getting a lot of attention in the last few years, all designed to make developing clean, elegant web pages and applications easier and more maintainable for both programmers and designers. This session will introduce the LESS pre-processor.",
                        FullDescription=@"CSS has so many choices, should I go responsive? Should I use a grid layout or build my own? Should I use a framework? Should I stab my eyeballs out with this rusty screwdriver? (That last one may just be my colleagues ;-) It's no wonder that a lot of developers don't find CSS friendly.
CSS pre-processors are trying to bridge the gap and make CSS a more organic and logical styling language while still being understandable. LESS, Leaner CSS, is one of these pre-processors and this session will provide an introduction to it as well as covering
Basic syntax including nesting
Variables and Mixins
Operations
Tooling & Build Integration
If you're interested in learning about writing better, maintainable CSS, this session might be for you."},
                    }
            };
        }
    }
}