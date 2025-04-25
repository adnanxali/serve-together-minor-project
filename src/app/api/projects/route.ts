
import { db } from "@/lib/firebase";
import axios from "axios";
import { addDoc,query,getDocs, where,collection, getDoc, doc } from "firebase/firestore";

import { NextRequest, NextResponse } from "next/server";
type Project = {
    id: string;
    orgId: string;
    location: {label:string,longitude:string,latitude:string};
    description: string;
    title: string;
    skillsReq: string[];
    duration: string;
  };

export async function GET(req: NextRequest) {
    try {
        const volId = req.headers.get('volunteerId');
        if (!volId) {
            return NextResponse.json({ error: 'Missing volunteerId in headers' }, { status: 400 });
          }
        const projectsRef = collection(db, "Project");
        const volRef = doc(db,'volunteer',volId);

        const docSnap = await getDocs(projectsRef)
        const volSnap = await getDoc(volRef);
        const voldData = volSnap.data()
        
        
        const mappedVolData = {
            name: voldData?.name,
            email:voldData?.email,
            skills:voldData?.skills,
            location:{
                latitude:voldData?.location.lat,
                longitude:voldData?.location.lng
            }
        }
        
        


        if (docSnap.empty) {
            return NextResponse.json({ success: false, msg: "No projects found !" }, { status: 404 });
        }

        const projects: Project[] = docSnap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<Project, 'id'>)
          }));
        
        
        const mappedProjects = projects.map(project => ({
            title: project.title,
            description: project.description,
            skillsReq: project.skillsReq.map(skill => skill.toLowerCase()),
            location: {
              label: project.location.label,
              latitude: parseFloat(project.location.latitude),
              longitude: parseFloat(project.location.longitude)
            }
          }));
        
        // const matchedProjects = await axios.post('http://127.0.0.1:3001/api/recommend',{
        //     volunteer: mappedVolData,
        //     projects: mappedProjects,
        // })
        // console.log(matchedProjects.data.recommendations    );
        
        return NextResponse.json({ success: true, data: projects }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
    }
}